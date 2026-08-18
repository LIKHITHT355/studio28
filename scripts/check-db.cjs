const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Load .env
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      process.env[key] = val;
    }
  }
}

async function verifyDatabase() {
  console.log("=== STUDIOS 28 MONGODB ATLAS DIAGNOSTIC ===");
  console.log("URI Configured:", process.env.MONGODB_URI ? "YES" : "NO");

  if (!process.env.MONGODB_URI) {
    console.error("Error: MONGODB_URI not found in .env");
    process.exit(1);
  }

  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    family: 4,
  });
  console.log("Status: CONNECTED SUCCESSFULLY!\n");

  const db = mongoose.connection.db;
  console.log("Database Name:", db.databaseName);

  const collections = await db.listCollections().toArray();
  console.log("Collections:", collections.map((c) => c.name));

  const ImageSchema = new mongoose.Schema({
    category: String,
    data: String,
    imageFileId: String,
    fileName: String,
    uploadedBy: String,
    createdAt: Date,
  });

  const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);

  const totalCount = await Image.countDocuments();
  console.log("\n--- COLLECTION: images ---");
  console.log("Total Documents Stored in Database:", totalCount);

  if (totalCount > 0) {
    const sampleImages = await Image.find().sort({ createdAt: -1 }).limit(10);
    console.log("\nStored Images in MongoDB Atlas:");
    sampleImages.forEach((img, idx) => {
      const dataPreview = img.data
        ? img.data.startsWith("data:")
          ? img.data.substring(0, 35) + "... [Base64 Image Data]"
          : img.data.substring(0, 50) + "..."
        : "no-data";
      console.log(`\n  [${idx + 1}] ID: ${img._id}`);
      console.log(`      Category:    ${img.category}`);
      console.log(`      FileName:    ${img.fileName}`);
      console.log(`      Uploaded By: ${img.uploadedBy || "admin"}`);
      console.log(`      Created At:  ${img.createdAt}`);
      console.log(`      ImageKit ID: ${img.imageFileId || "(none — legacy/seed)"}`);
      console.log(`      Data:        ${dataPreview}`);
    });
  } else {
    console.log("Collection is currently empty (it will auto-seed upon first page visit or admin upload).");
  }

  // Test Write & Read & Delete
  console.log("\n--- LIVE WRITE & READ VERIFICATION ---");
  const testImage = await Image.create({
    category: "Wedding",
    data: "https://images.unsplash.com/photo-1519741497674-611481863552",
    fileName: "verification-test.jpg",
    uploadedBy: "system-check",
    createdAt: new Date(),
  });
  console.log("1. Insert Test: SUCCESS! (Created ID:", testImage._id.toString() + ")");

  const retrieved = await Image.findById(testImage._id);
  console.log("2. Read Test:   SUCCESS! (Retrieved:", retrieved.fileName + ")");

  await Image.findByIdAndDelete(testImage._id);
  console.log("3. Delete Test: SUCCESS! (Cleaned up temporary test record)");

  console.log("\n==============================================");
  console.log("VERIFICATION RESULT: MongoDB Atlas is ACTIVE,");
  console.log("READ & WRITE OPERATIONS ARE FULLY FUNCTIONAL!");
  console.log("==============================================");

  await mongoose.disconnect();
  process.exit(0);
}

verifyDatabase().catch((err) => {
  console.error("Verification failed:", err.message);
  process.exit(1);
});
