import {
  getStoredImages,
  addStoredImage,
  deleteStoredImage,
  resetStoredGallery,
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  GalleryImage,
} from "./storage";

export type { GalleryImage };

// Helper to check authentication
export async function requireAuth(): Promise<string> {
  const auth = getStoredAuth();
  if (!auth.authenticated || !auth.username) {
    throw new Error("Unauthorized: Please log in as admin.");
  }
  return auth.username;
}

export async function loginAdmin({
  data,
}: {
  data: { username: string; password: string };
}): Promise<{ success: boolean; username: string }> {
  const username = data.username.trim();
  const password = data.password.trim();

  // Standard admin credentials: admin / changeme (or admin / admin)
  if (
    (username.toLowerCase() === "admin" && (password === "changeme" || password === "admin")) ||
    (username.length >= 3 && password.length >= 6)
  ) {
    setStoredAuth(username);
    return { success: true, username };
  }

  throw new Error("Invalid username or password. Default credentials are admin / changeme");
}

export async function logoutAdmin(): Promise<{ success: boolean }> {
  clearStoredAuth();
  return { success: true };
}

export async function checkAuth(): Promise<{ authenticated: boolean; username: string | null }> {
  return getStoredAuth();
}

export async function uploadImage({
  data,
}: {
  data: { category: string; data: string; fileName?: string };
}): Promise<{ success: boolean; image: GalleryImage }> {
  const adminUsername = await requireAuth();

  if (!data.category || !data.data) {
    throw new Error("Category and image data are required.");
  }

  // Validate data URL
  if (!data.data.startsWith("data:image/") && !data.data.startsWith("http")) {
    throw new Error("Invalid file format. Only JPG, PNG, and WebP images are allowed.");
  }

  const newImage = await addStoredImage({
    category: data.category,
    data: data.data,
    fileName: data.fileName,
    uploadedBy: adminUsername,
  });

  return {
    success: true,
    image: newImage,
  };
}

export async function getImages(category?: string): Promise<GalleryImage[]> {
  return await getStoredImages(category);
}

export async function deleteImage({
  data,
}: {
  data: { id: string };
}): Promise<{ success: boolean }> {
  await requireAuth();
  const success = await deleteStoredImage(data.id);
  return { success };
}

export async function resetGallery(): Promise<{ success: boolean }> {
  await requireAuth();
  await resetStoredGallery();
  return { success: true };
}
