#!/usr/bin/env node
/**
 * Test upload pipeline - calls the uploadImage server function directly
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a simple test image (1x1 pixel PNG)
const testImageBuffer = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xf8, 0x0f, 0x00, 0x00,
  0x01, 0x01, 0x00, 0x05, 0xb0, 0xee, 0xfb, 0x4d, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44,
  0xae, 0x42, 0x60, 0x82,
]);

const base64Data = `data:image/png;base64,${testImageBuffer.toString("base64")}`;

async function testUpload() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("🔍 UPLOAD PIPELINE TEST");
  console.log("═══════════════════════════════════════════════════════════════\n");

  // We'll make an HTTP POST request to the local dev server
  const payload = {
    category: "Wedding",
    data: base64Data,
    fileName: "test-upload.png",
  };

  console.log("📤 Sending upload request...");
  console.log("  Category: Wedding");
  console.log("  File: test-upload.png");
  console.log("  Size: ~100 bytes (test image)\n");

  try {
    const response = await fetch("http://localhost:5174/api/server/uploadImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("\n📦 Response received:");
    console.log(JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log("\n✅ UPLOAD TEST COMPLETED SUCCESSFULLY");
    } else {
      console.log("\n❌ UPLOAD TEST FAILED");
      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    process.exit(1);
  }
}

testUpload();
