import ImageKit from "@imagekit/nodejs";

// ─── Env-var resolution ────────────────────────────────────────────────
// Works across local dev, Vite SSR, and Cloudflare Workers
function getEnvVar(key: string): string {
  let val =
    process.env[key] ||
    (typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env[key]
      : undefined) ||
    (globalThis as Record<string, unknown>)[key];

  // Fallback: read from .env on disk (dev server only)
  if (!val && typeof process !== "undefined" && process.cwd) {
    try {
      const fs = require("node:fs");
      const path = require("node:path");
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
            const idx = trimmed.indexOf("=");
            const k = trimmed.substring(0, idx).trim();
            const v = trimmed.substring(idx + 1).trim();
            if (k === key) {
              val = v;
              process.env[key] = v;
              break;
            }
          }
        }
      }
    } catch {
      // Ignore in worker environment
    }
  }

  return val ? String(val).trim() : "";
}

function maskSecret(val: string): string {
  if (!val) return "(not set)";
  if (val.length <= 8) return val.substring(0, 2) + "***" + val.substring(val.length - 2);
  return val.substring(0, 5) + "..." + val.substring(val.length - 4);
}

// ─── Singleton ImageKit instance ───────────────────────────────────────
let _ik: ImageKit | null = null;

export function getImageKit(): ImageKit {
  if (_ik) return _ik;

  const privateKey = getEnvVar("IMAGEKIT_PRIVATE_KEY");
  const publicKey = getEnvVar("IMAGEKIT_PUBLIC_KEY");
  const urlEndpoint = getEnvVar("IMAGEKIT_URL_ENDPOINT");

  if (!privateKey) {
    throw new Error(
      "ImageKit credentials missing. Set IMAGEKIT_PRIVATE_KEY (and optionally IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT) in .env"
    );
  }

  console.log("[ImageKit Init] Client credentials:", {
    publicKey: maskSecret(publicKey),
    privateKey: maskSecret(privateKey),
    urlEndpoint: urlEndpoint || "(default)",
  });

  const clientConfig: Record<string, unknown> = { privateKey };
  if (urlEndpoint) {
    clientConfig.urlEndpoint = urlEndpoint;
  }
  if (publicKey) {
    clientConfig.publicKey = publicKey;
  }

  _ik = new ImageKit(clientConfig as any);

  return _ik;
}

// ─── Upload helper ─────────────────────────────────────────────────────
export interface ImageKitUploadResult {
  url: string;
  fileId: string;
  filePath?: string;
  size: number;
}

/**
 * Upload an image buffer (as base64 data URI or raw base64) to ImageKit.
 *
 * @param base64Data  Full data URI (`data:image/...;base64,...`) or raw base64 string
 * @param fileName    Desired file name (will be sanitized and validated)
 * @param folder      Category/folder name, e.g. "Wedding" → stored under /gallery/wedding
 */
export async function uploadImageToImageKit(
  base64Data: string,
  fileName: string,
  folder: string
): Promise<ImageKitUploadResult> {
  const ik = getImageKit();
  const urlEndpoint = getEnvVar("IMAGEKIT_URL_ENDPOINT");

  if (!base64Data || typeof base64Data !== "string") {
    throw new Error("Invalid payload: base64Data must be a non-empty string.");
  }

  // 1. Consistent payload handling: Extract clean raw base64 string
  const rawBase64 = base64Data.includes(",")
    ? base64Data.split(",")[1].trim()
    : base64Data.trim();

  // 2. Validate and sanitize fileName
  let cleanFileName = (fileName || `image-${Date.now()}.jpg`)
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "_");

  if (!cleanFileName.includes(".")) {
    cleanFileName += ".jpg";
  }

  // 3. Normalize destination folder (/gallery/{category-lowercase})
  const cleanFolder = `/gallery/${(folder || "other").toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;

  // Log exact string being passed: first 50 chars + total length
  console.log("[ImageKit Upload Prep]", {
    fileName: cleanFileName,
    targetFolder: cleanFolder,
    payloadLength: rawBase64.length,
    payloadPrefix: rawBase64.substring(0, 50) + "...",
  });

  try {
    const result = await ik.files.upload({
      file: rawBase64,
      fileName: cleanFileName,
      folder: cleanFolder,
      useUniqueFileName: true,
    });

    if (!result || !result.fileId) {
      throw new Error("ImageKit upload returned an incomplete response (no fileId).");
    }

    console.log("[ImageKit Upload Success] Raw API response:", {
      fileId: result.fileId,
      name: result.name,
      filePath: result.filePath,
      url: result.url,
      size: result.size,
    });

    // 4. Post-upload verification: get details and check size > 0
    console.log(`[ImageKit Post-Upload Verify] Fetching details for fileId "${result.fileId}"...`);
    const verified = await ik.files.get(result.fileId);

    if (!verified || !verified.fileId) {
      throw new Error(`ImageKit verification failed: File "${result.fileId}" was not found after upload.`);
    }

    const verifiedSize = typeof verified.size === "number" ? verified.size : result.size || 0;
    if (verifiedSize <= 0) {
      // Clean up corrupt/empty upload immediately
      await ik.files.delete(result.fileId).catch(() => {});
      throw new Error(
        `ImageKit upload validation failed: Uploaded file size is 0 bytes (corrupt/empty payload).`
      );
    }

    console.log("[ImageKit Verification Confirmed]", {
      fileId: verified.fileId,
      size: `${verifiedSize} bytes`,
      filePath: verified.filePath,
      url: verified.url,
    });

    // Determine public URL
    let finalUrl = verified.url || result.url || "";
    if (!finalUrl && urlEndpoint && result.filePath) {
      const cleanEndpoint = urlEndpoint.replace(/\/+$/, "");
      const cleanPath = result.filePath.replace(/^\/+/, "");
      finalUrl = `${cleanEndpoint}/${cleanPath}`;
    }

    if (!finalUrl) {
      throw new Error("ImageKit upload succeeded but returned no access URL.");
    }

    return {
      url: finalUrl,
      fileId: result.fileId,
      filePath: verified.filePath || result.filePath,
      size: verifiedSize,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ImageKit Upload Error Stack]:", err);
    throw new Error(`ImageKit upload failed: ${message}`);
  }
}

// ─── Get file details helper (for verification) ────────────────────────

/**
 * Fetch detailed information about a file from ImageKit by its fileId.
 * Used to verify file size > 0 after upload.
 */
export async function getFileDetailsFromImageKit(
  fileId: string
): Promise<{ fileId: string; size: number; filePath: string; url: string } | null> {
  if (!fileId) return null;

  try {
    const ik = getImageKit();
    const details = await ik.files.get(fileId);

    if (!details || !details.fileId) {
      return null;
    }

    return {
      fileId: details.fileId,
      size: typeof details.size === "number" ? details.size : 0,
      filePath: details.filePath || "",
      url: details.url || "",
    };
  } catch (err) {
    console.warn(`[ImageKit Get Details Failed] FileId "${fileId}":`, err instanceof Error ? err.message : err);
    return null;
  }
}

// ─── Delete helper ─────────────────────────────────────────────────────

/**
 * Delete an image from ImageKit by its fileId.
 */
export async function deleteImageFromImageKit(fileId: string): Promise<boolean> {
  if (!fileId) return false;

  try {
    const ik = getImageKit();
    await ik.files.delete(fileId);
    console.log(`[ImageKit Delete Success] File "${fileId}" deleted.`);
    return true;
  } catch (err) {
    console.warn(
      `ImageKit delete failed for fileId "${fileId}":`,
      err instanceof Error ? err.message : err
    );
    return false;
  }
}
