import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie, setResponseHeader } from "@tanstack/react-start/server";

export interface GalleryImage {
  id: string;
  cat: string;
  src: string;
  fileName: string;
  uploadedBy?: string;
  createdAt: string;
  alt: string;
}

// Check admin authentication from session cookie
async function requireAuth(): Promise<string> {
  const token = getCookie("admin_token");
  if (!token || typeof token !== "string" || token.trim() === "") {
    throw new Error("Unauthorized: Please log in as admin.");
  }
  return token;
}

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const username = data.username.trim();
    const password = data.password.trim();

    if (!username || !password) {
      throw new Error("Please enter both username and password.");
    }

    if (username.length < 3 || password.length < 6) {
      throw new Error("Invalid username or password. Password must be at least 6 characters.");
    }

    setCookie("admin_token", username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, username };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie("admin_token", { path: "/" });
  return { success: true };
});

export const checkAuth = createServerFn({ method: "GET" }).handler(async () => {
  setResponseHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  const token = getCookie("admin_token");
  if (!token || typeof token !== "string" || token.trim() === "") {
    return { authenticated: false, username: null };
  }
  return { authenticated: true, username: token };
});

export const uploadImage = createServerFn({ method: "POST" })
  .validator((data: { category: string; data: string; fileName?: string }) => data)
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    const adminUsername = await requireAuth();

    if (!data.category || !data.data) {
      throw new Error("Category and image data are required.");
    }

    // Validate format
    if (!data.data.startsWith("data:image/") && !data.data.startsWith("http")) {
      throw new Error("Invalid file format. Only JPG, PNG, and WebP images are allowed.");
    }

    const timestamp = Date.now();
    const uniqueSuffix = Math.random().toString(36).substring(2, 7);
    const cleanFileName = data.fileName
      ? `${timestamp}-${uniqueSuffix}-${data.fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      : `image-${timestamp}-${uniqueSuffix}.jpg`;

    const { connectToDatabase, Image, withTimeout } = await import("./db");
    const db = await connectToDatabase();
    if (!db) {
      throw new Error("Database is not reachable. Please check your MONGODB_URI configuration.");
    }

    const newImage = await withTimeout(
      Image.create({
        category: data.category,
        data: data.data,
        fileName: cleanFileName,
        uploadedBy: adminUsername,
        createdAt: new Date(),
      }),
      8000,
      "Image upload operation timed out"
    );

    return {
      success: true,
      image: {
        id: newImage._id.toString(),
        cat: newImage.category,
        src: newImage.data,
        fileName: newImage.fileName,
        uploadedBy: newImage.uploadedBy,
        createdAt: newImage.createdAt.toISOString(),
        alt: `${newImage.category} showcase image`,
      },
    };
  });

export const getImages = createServerFn({ method: "GET" })
  .validator((category?: string) => category)
  .handler(async ({ data: category }) => {
    setResponseHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    const { connectToDatabase, Image, DEFAULT_SEED_IMAGES, seedImagesIfEmpty, withTimeout } = await import("./db");

    const fallbackList = DEFAULT_SEED_IMAGES.map((img) => ({
      id: img.id,
      cat: img.category,
      src: img.data,
      fileName: img.fileName,
      uploadedBy: img.uploadedBy,
      createdAt: img.createdAt.toISOString(),
      alt: `${img.category} showcase image`,
    }));

    try {
      const db = await connectToDatabase();
      if (!db) {
        return category && category !== "All"
          ? fallbackList.filter((img) => img.cat.toLowerCase() === category.toLowerCase())
          : fallbackList;
      }

      await seedImagesIfEmpty();

      interface ImageDoc {
        _id: { toString(): string };
        category: string;
        data: string;
        fileName?: string;
        uploadedBy?: string;
        createdAt?: Date;
      }

      const query = category && category !== "All" ? { category } : {};
      const images = (await withTimeout(
        Image.find(query).sort({ createdAt: -1 }).lean(),
        4000,
        "Fetch images timed out"
      )) as unknown as ImageDoc[];

      if (!images || images.length === 0) {
        return category && category !== "All"
          ? fallbackList.filter((img) => img.cat.toLowerCase() === category.toLowerCase())
          : fallbackList;
      }

      return images.map((img) => ({
        id: img._id.toString(),
        cat: img.category,
        src: img.data,
        fileName: img.fileName || "image.jpg",
        uploadedBy: img.uploadedBy || "admin",
        createdAt: (img.createdAt ? new Date(img.createdAt) : new Date()).toISOString(),
        alt: `${img.category} showcase image`,
      }));
    } catch (err) {
      console.warn("getImages encountered error, using fallback seed images:", (err as Error).message);
      return category && category !== "All"
        ? fallbackList.filter((img) => img.cat.toLowerCase() === category.toLowerCase())
        : fallbackList;
    }
  });

export const deleteImage = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    await requireAuth();
    const { connectToDatabase, Image, withTimeout } = await import("./db");
    const db = await connectToDatabase();
    if (!db) {
      throw new Error("Database is not reachable.");
    }

    const result = await withTimeout(
      Image.findByIdAndDelete(data.id),
      5000,
      "Delete operation timed out"
    );

    if (!result) {
      throw new Error("Image not found or already deleted.");
    }
    return { success: true };
  });

export const resetGallery = createServerFn({ method: "POST" }).handler(async () => {
  setResponseHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  await requireAuth();
  const { connectToDatabase, Image, DEFAULT_SEED_IMAGES, withTimeout } = await import("./db");
  const db = await connectToDatabase();
  if (!db) {
    throw new Error("Database is not reachable.");
  }

  await withTimeout(Image.deleteMany({}), 5000, "Reset delete timed out");
  await withTimeout(Image.insertMany(DEFAULT_SEED_IMAGES), 5000, "Reset insert timed out");

  return { success: true };
});
