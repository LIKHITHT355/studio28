const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

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

async function migrateAndCheck() {
  console.log("Connecting to MongoDB Atlas...");
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "studios28",
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    family: 4,
  });

  const testDb = conn.connection.client.db("test");
  const studios28Db = conn.connection.client.db("studios28");

  // Check if test db had images
  const testImages = await testDb.collection("images").find().toArray();
  console.log(`Found ${testImages.length} images in 'test' database.`);

  if (testImages.length > 0) {
    console.log("Migrating images to 'studios28' database -> 'images' collection...");
    for (const img of testImages) {
      await studios28Db.collection("images").updateOne(
        { _id: img._id },
        { $set: img },
        { upsert: true }
      );
    }
  }

  const studiosCount = await studios28Db.collection("images").countDocuments();
  console.log(`Total images now in database 'studios28' -> collection 'images': ${studiosCount}`);

  await mongoose.disconnect();
  console.log("Done!");
}

migrateAndCheck().catch(console.error);
