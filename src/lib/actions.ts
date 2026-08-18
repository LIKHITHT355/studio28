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
  imageFileId?: string;
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

/**
 * Helper: Get current time in HH:MM:SS format for terminal logging
 */
function getTimestamp(): string {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}

export const uploadImage = createServerFn({ method: "POST" })
  .validator((data: { category: string; data: string; fileName?: string }) => data)
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

    const timestamp = Date.now();
    const uniqueSuffix = Math.random().toString(36).substring(2, 7);
    const cleanFileName = data.fileName
      ? `${timestamp}-${uniqueSuffix}-${data.fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      : `image-${timestamp}-${uniqueSuffix}.jpg`;

    let adminUsername: string;
    let ikResult: { fileId: string; url: string; size: number } | null = null;

    // ─────────────────────────────────────────────────────────────────
    // STEP 1: UPLOAD TO IMAGEKIT (with verification)
    // ─────────────────────────────────────────────────────────────────
    try {
      const step1Start = getTimestamp();
      console.log(`[${step1Start}] STEP 1 START → ImageKit upload and verification`);

      try {
        adminUsername = await requireAuth();
      } catch (authErr) {
        console.error("[STEP 1 - Auth Failed]", authErr);
        throw authErr;
      }

      if (!data.category || !data.data) {
        throw new Error("Category and image data are required.");
      }

      // Validate format
      if (!data.data.startsWith("data:image/") && !data.data.startsWith("http")) {
        throw new Error("Invalid file format. Only JPG, PNG, and WebP images are allowed.");
      }

      // Import ImageKit utility
      const { uploadImageToImageKit } = await import("./imagekit");

      // Perform the upload
      ikResult = await uploadImageToImageKit(data.data, cleanFileName, data.category);

      if (!ikResult || !ikResult.fileId || !ikResult.url) {
        throw new Error("ImageKit upload did not return a valid fileId or URL.");
      }

      console.log("[UPLOAD] ImageKit success:", {
        fileId: ikResult.fileId,
        url: ikResult.url,
        size: ikResult.size,
      });

      // uploadImageToImageKit already performs an ImageKit file-details lookup
      // and rejects missing or zero-byte files. Do not make that same API call
      // a second time here: it adds latency to every upload without adding a
      // new validation boundary.
      if (ikResult.size <= 0) {
        throw new Error(
          `ImageKit verification failed: File size is ${ikResult.size} bytes (corrupt/empty).`
        );
      }

      console.log("[UPLOAD] ImageKit verification passed:", {
        fileId: ikResult.fileId,
        verifiedSize: ikResult.size,
      });

      const step1End = getTimestamp();
      console.log(`[${step1End}] STEP 1 DONE → ImageKit upload + verification succeeded`);
    } catch (step1Err) {
      const step1Error = step1Err instanceof Error ? step1Err.message : String(step1Err);
      console.error("[UPLOAD] ImageKit failed:", step1Error);
      console.error(`[${getTimestamp()}] STEP 1 FAILED → stopping pipeline`);
      throw new Error(`[STEP 1 FAILED] ImageKit upload: ${step1Error}`);
    }

    // Database access starts only after the upload helper has returned a
    // verified ImageKit file. Each operation owns its Worker-safe connection.
    const { withImageDatabase, withTimeout } = await import("./db");

    // ─────────────────────────────────────────────────────────────────
    // STEP 2: SAVE TO DATABASE (only if Step 1 succeeded)
    // ─────────────────────────────────────────────────────────────────
    let savedImageId: string | null = null;

    try {
      const step2Start = getTimestamp();
      console.log(`[${step2Start}] STEP 2 START → MongoDB save`);

      const newImage = await withImageDatabase(async (Image) => {
        const newImageDoc = new Image({
          category: data.category,
          data: ikResult!.url,
          imageFileId: ikResult!.fileId,
          fileName: cleanFileName,
          uploadedBy: adminUsername!,
          createdAt: new Date(),
        });
        return withTimeout(
          newImageDoc.save(),
          30000,
          "Database save operation timed out after 30 seconds"
        );
      });

      savedImageId = newImage._id.toString();

      console.log("[DB] Saved image doc:", {
        _id: savedImageId,
        fileId: ikResult!.fileId,
      });

      const step2End = getTimestamp();
      console.log(`[${step2End}] STEP 2 DONE → MongoDB save succeeded`);
    } catch (step2Err) {
      const step2Error = step2Err instanceof Error ? step2Err.message : String(step2Err);
      console.error("[DB] Save failed:", step2Error);
      console.error(`[${getTimestamp()}] STEP 2 FAILED → stopping pipeline, orphaned ImageKit fileId:`, ikResult?.fileId);

      // Do not delete a verified ImageKit file just because MongoDB failed.
      // The URL is returned in the error so the asset can be opened directly
      // or recovered into the database after connectivity is restored.
      throw new Error(
        `[STEP 2 FAILED] MongoDB save: ${step2Error}. ImageKit file was retained: ${ikResult?.url} (fileId: ${ikResult?.fileId})`
      );
    }

    // ─────────────────────────────────────────────────────────────────
    // STEP 3: RENDER IN UI (verify in fresh DB fetch, only if Step 2 succeeded)
    // Reuses existing DB connection from earlier
    // ─────────────────────────────────────────────────────────────────
    try {
      const step3Start = getTimestamp();
      console.log(`[${step3Start}] STEP 3 START → re-fetch images and verify presence`);

      // Re-fetch ALL images (not filtered, not cached) to verify the new one is present
      interface ImageDoc {
        _id: { toString(): string };
        category: string;
        data: string;
        imageFileId?: string;
        fileName?: string;
        uploadedBy?: string;
        createdAt?: Date;
      }

      const allImages = (await withImageDatabase((Image) =>
        withTimeout(
          Image.find({}).sort({ createdAt: -1 }).lean().maxTimeMS(25000).exec(),
          30000,
          "Final re-fetch images timed out"
        )
      )) as unknown as ImageDoc[];

      // Verify newly uploaded image is present
      const newImagePresent = allImages.some((img) => img._id.toString() === savedImageId);

      console.log("[RENDER] New image present in fetched list:", newImagePresent);

      if (!newImagePresent) {
        throw new Error(
          `Verification failed: Newly saved image (ID: ${savedImageId}) not found in re-fetched list.`
        );
      }

      // Build gallery response from fresh fetch
      const galleryData = allImages.map((img) => ({
        id: img._id.toString(),
        cat: img.category,
        src: img.data,
        fileName: img.fileName || "image.jpg",
        uploadedBy: img.uploadedBy || "admin",
        createdAt: (img.createdAt ? new Date(img.createdAt) : new Date()).toISOString(),
        alt: `${img.category} showcase image`,
        imageFileId: img.imageFileId,
      }));

      const step3End = getTimestamp();
      console.log(`[${step3End}] STEP 3 DONE → re-fetch and verification succeeded, gallery rendered`);

      // Return the newly uploaded image details
      const newImageDetail = galleryData.find((img) => img.id === savedImageId);

      return {
        success: true,
        image: newImageDetail || {
          id: savedImageId,
          cat: data.category,
          src: ikResult!.url,
          fileName: cleanFileName,
          uploadedBy: adminUsername!,
          createdAt: new Date().toISOString(),
          alt: `${data.category} showcase image`,
          imageFileId: ikResult!.fileId,
        },
      };
    } catch (step3Err) {
      const step3Error = step3Err instanceof Error ? step3Err.message : String(step3Err);
      console.error("[RENDER] Verification/fetch failed:", step3Error);
      console.error(`[${getTimestamp()}] STEP 3 FAILED → pipeline error`);

      throw new Error(`[STEP 3 FAILED] UI render verification: ${step3Error}`);
    }
  });

export const getImages = createServerFn({ method: "GET" })
  .validator((category?: string) => category)
  .handler(async ({ data: category }) => {
    setResponseHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    const { withImageDatabase, withTimeout } = await import("./db");

    try {
      interface ImageDoc {
        _id: { toString(): string };
        category: string;
        data: string;
        imageFileId?: string;
        fileName?: string;
        uploadedBy?: string;
        createdAt?: Date;
      }

      const query = category && category !== "All" ? { category: { $regex: new RegExp(`^${category}$`, "i") } } : {};
      const images = (await withImageDatabase((Image) =>
        withTimeout(
          // maxTimeMS makes MongoDB terminate the query too. Promise.race alone
          // only stops waiting and leaves a slow query running in the Worker.
          Image.find(query).sort({ createdAt: -1 }).lean().maxTimeMS(10000).exec(),
          12000,
          "Fetch images timed out"
        )
      )) as unknown as ImageDoc[];

      if (!images || images.length === 0) {
        return [];
      }

      return images.map((img) => ({
        id: img._id.toString(),
        cat: img.category,
        src: img.data,
        fileName: img.fileName || "image.jpg",
        uploadedBy: img.uploadedBy || "admin",
        createdAt: (img.createdAt ? new Date(img.createdAt) : new Date()).toISOString(),
        alt: `${img.category} showcase image`,
        imageFileId: img.imageFileId,
      }));
    } catch (err) {
      console.warn("getImages encountered error:", (err as Error).message);
      // Returning [] turns a database outage into a successful empty-gallery
      // response. Throw so React Query preserves its previous cache and shows
      // a real error state instead.
      throw err;
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

    // First find the document to get its imageFileId
    const existing = await withTimeout(
      Image.findById(data.id).lean(),
      5000,
      "Find operation timed out"
    ) as { imageFileId?: string } | null;

    if (!existing) {
      throw new Error("Image not found or already deleted.");
    }

    // Delete from ImageKit if this image has a fileId (new uploads)
    if (existing.imageFileId) {
      const { deleteImageFromImageKit } = await import("./imagekit");
      await deleteImageFromImageKit(existing.imageFileId);
    }

    // Delete from MongoDB
    await withTimeout(
      Image.findByIdAndDelete(data.id),
      5000,
      "Delete operation timed out"
    );

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

  // Best-effort: delete ImageKit files for any images that have fileIds
  try {
    const imagesWithFileIds = await withTimeout(
      Image.find({ imageFileId: { $exists: true, $ne: null } }).select("imageFileId").lean(),
      5000,
      "Fetch imageFileIds timed out"
    ) as { imageFileId?: string }[];

    if (imagesWithFileIds.length > 0) {
      const { deleteImageFromImageKit } = await import("./imagekit");
      await Promise.allSettled(
        imagesWithFileIds.map((img) =>
          img.imageFileId ? deleteImageFromImageKit(img.imageFileId) : Promise.resolve()
        )
      );
    }
  } catch (err) {
    console.warn("Could not clean up ImageKit files during gallery reset:", (err as Error).message);
  }

  await withTimeout(Image.deleteMany({}), 5000, "Reset delete timed out");
  await withTimeout(Image.insertMany(DEFAULT_SEED_IMAGES), 5000, "Reset insert timed out");

  return { success: true };
});
