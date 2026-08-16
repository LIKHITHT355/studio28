import mongoose, { Model } from "mongoose";
import bcrypt from "bcryptjs";

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/studios28";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache || {
  conn: null,
  promise: null,
};

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("Connected to MongoDB");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// User Model Interface & Schema
export interface IUser {
  username: string;
  passwordHash: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

// Image Model Interface & Schema
export interface IImage {
  category: string;
  data: string;
  fileName: string;
  uploadedBy: string;
  createdAt: Date;
}

const ImageSchema = new mongoose.Schema<IImage>({
  category: { type: String, required: true },
  data: { type: String, required: true }, // Base64 image data / URL
  fileName: { type: String, default: "image.jpg" },
  uploadedBy: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
});

export const Image: Model<IImage> =
  (mongoose.models.Image as Model<IImage>) || mongoose.model<IImage>("Image", ImageSchema);

// Seed Admin User
export async function seedAdmin(): Promise<void> {
  await connectToDatabase();
  const adminExists = await User.findOne({ username: "admin" });
  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("changeme", salt);
    await User.create({ username: "admin", passwordHash });
    console.log("Seeded admin user");
  }
}
