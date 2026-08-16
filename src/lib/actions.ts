import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

// All server-only imports (mongoose, bcrypt) are dynamically imported
// inside handlers so Vite never bundles them into client code.

// Helper to check auth and return authenticated username
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
    const { connectToDatabase, User, seedAdmin } = await import("./db");
    const bcrypt = (await import("bcryptjs")).default;

    // Seed admin on first login attempt if not yet seeded
    await seedAdmin();
    await connectToDatabase();

    const user = await User.findOne({ username: data.username.trim() });
    if (!user) {
      throw new Error("Invalid username or password");
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid username or password");
    }

    setCookie("admin_token", user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, username: user.username };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie("admin_token", { path: "/" });
  return { success: true };
});

export const checkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie("admin_token");
  if (!token || typeof token !== "string" || token.trim() === "") {
    return { authenticated: false, username: null };
  }
  return { authenticated: true, username: token };
});

export const uploadImage = createServerFn({ method: "POST" })
  .validator((data: { category: string; data: string; fileName?: string }) => data)
  .handler(async ({ data }) => {
    const adminUsername = await requireAuth();

    if (!data.category || !data.data) {
      throw new Error("Category and image data are required.");
    }

    // Validate file type (jpg/png/webp only)
    const mimeMatch = data.data.match(/^data:image\/(jpeg|jpg|png|webp);base64,/i);
    if (!mimeMatch) {
      throw new Error("Invalid file format. Only JPG, PNG, and WebP images are allowed.");
    }

    // Validate max size 5MB (Base64 string length approximation: 5MB ~ 5 * 1024 * 1024 * 1.37 bytes)
    const base64Data = data.data.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
    const estimatedSizeBytes = (base64Data.length * 3) / 4;
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    if (estimatedSizeBytes > maxSizeBytes) {
      throw new Error("File exceeds maximum size limit of 5MB.");
    }

    const { connectToDatabase, Image } = await import("./db");
    await connectToDatabase();

    const newImage = await Image.create({
      category: data.category,
      data: data.data,
      fileName:
        data.fileName || `image-${Date.now()}.${mimeMatch[1] === "jpeg" ? "jpg" : mimeMatch[1]}`,
      uploadedBy: adminUsername,
    });

    return {
      success: true,
      image: {
        id: newImage._id.toString(),
        cat: newImage.category,
        src: newImage.data,
        fileName: newImage.fileName,
        uploadedBy: newImage.uploadedBy,
        createdAt: newImage.createdAt,
      },
    };
  });

export const getImages = createServerFn({ method: "GET" })
  .validator((category?: string) => category)
  .handler(async ({ data: category }) => {
    const { connectToDatabase, Image } = await import("./db");
    await connectToDatabase();

    interface ImageDoc {
      _id: { toString(): string };
      category: string;
      data: string;
      fileName?: string;
      uploadedBy?: string;
      createdAt?: Date;
    }

    const query = category && category !== "All" ? { category } : {};
    const images = (await Image.find(query)
      .sort({ createdAt: -1 })
      .lean()) as unknown as ImageDoc[];

    return images.map((img) => ({
      id: img._id.toString(),
      cat: img.category,
      src: img.data,
      fileName: img.fileName || "image.jpg",
      uploadedBy: img.uploadedBy || "admin",
      createdAt: img.createdAt,
      alt: `${img.category} image`,
    }));
  });

export const deleteImage = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAuth();
    const { connectToDatabase, Image } = await import("./db");
    await connectToDatabase();

    const result = await Image.findByIdAndDelete(data.id);
    if (!result) {
      throw new Error("Image not found or already deleted.");
    }
    return { success: true };
  });
