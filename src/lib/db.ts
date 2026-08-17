import mongoose, { Model } from "mongoose";

// Universal MongoDB URI extraction across local, Vite, SSR, and Cloudflare Workers
function getMongoUri(): string {
  const uri =
    process.env.MONGODB_URI ||
    (typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.MONGODB_URI || import.meta.env.VITE_MONGODB_URI
      : undefined) ||
    (globalThis as Record<string, unknown>).MONGODB_URI ||
    (globalThis as { process?: { env?: Record<string, string> } })?.process?.env?.MONGODB_URI;

  if (!uri || String(uri).trim() === "") {
    return "";
  }
  return String(uri).trim();
}

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

// Timeout wrapper to guarantee Worker never hangs
export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = getMongoUri();
  if (!uri) {
    console.warn("MONGODB_URI not configured, operating with seed images");
    return null;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "studios28",
      bufferCommands: false,
      autoIndex: false,
      maxPoolSize: 1,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
      socketTimeoutMS: 8000,
      family: 4,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      console.log("Connected to MongoDB Atlas");
      return m;
    });
  }

  try {
    cached.conn = await withTimeout(cached.promise, 4500, "MongoDB connection timed out");
    return cached.conn;
  } catch (e) {
    console.warn("MongoDB connection failed or timed out:", (e as Error).message);
    cached.promise = null;
    cached.conn = null;
    return null;
  }
}

// User Model
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

// Image Model
export interface IImage {
  category: string;
  data: string;
  fileName: string;
  uploadedBy: string;
  createdAt: Date;
}

const ImageSchema = new mongoose.Schema<IImage>({
  category: { type: String, required: true, index: true },
  data: { type: String, required: true },
  fileName: { type: String, default: "image.jpg" },
  uploadedBy: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now, index: true },
});

export const Image: Model<IImage> =
  (mongoose.models.Image as Model<IImage>) || mongoose.model<IImage>("Image", ImageSchema);

export const DEFAULT_SEED_IMAGES = [
  {
    id: "seed-wed-1",
    category: "Wedding",
    data: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    fileName: "grand-wedding-ceremony.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 14),
  },
  {
    id: "seed-wed-2",
    category: "Wedding",
    data: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    fileName: "traditional-bridal-portrait.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 12),
  },
  {
    id: "seed-wed-3",
    category: "Wedding",
    data: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    fileName: "candid-wedding-rituals.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 10),
  },
  {
    id: "seed-wed-4",
    category: "Wedding",
    data: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
    fileName: "sunset-vows.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 9),
  },
  {
    id: "seed-pre-1",
    category: "Pre-Wedding",
    data: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
    fileName: "golden-hour-romance.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 8),
  },
  {
    id: "seed-pre-2",
    category: "Pre-Wedding",
    data: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
    fileName: "lakeside-couple-story.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: "seed-pre-3",
    category: "Pre-Wedding",
    data: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
    fileName: "intimate-studio-moment.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 6),
  },
  {
    id: "seed-port-1",
    category: "Portrait",
    data: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    fileName: "fashion-studio-portrait.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: "seed-port-2",
    category: "Portrait",
    data: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    fileName: "classic-monochrome.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 4),
  },
  {
    id: "seed-port-3",
    category: "Portrait",
    data: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    fileName: "artistic-lighting-editorial.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: "seed-evt-1",
    category: "Events",
    data: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    fileName: "corporate-gala.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "seed-evt-2",
    category: "Events",
    data: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    fileName: "concert-stage-lights.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "seed-evt-3",
    category: "Events",
    data: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    fileName: "celebration-festivities.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 1),
  },
  {
    id: "seed-oth-1",
    category: "Other",
    data: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=1200&q=80",
    fileName: "maternity-grace.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 1),
  },
  {
    id: "seed-oth-2",
    category: "Other",
    data: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80",
    fileName: "brand-product-showcase.jpg",
    uploadedBy: "admin",
    createdAt: new Date(),
  },
];

// Seed images if database is empty
export async function seedImagesIfEmpty(): Promise<void> {
  const db = await connectToDatabase();
  if (!db) return;
  try {
    const count = await withTimeout(Image.countDocuments(), 3000, "Count timeout");
    if (count === 0) {
      console.log("Seeding initial gallery showcase images into MongoDB Atlas...");
      await withTimeout(Image.insertMany(DEFAULT_SEED_IMAGES), 4000, "Seed insert timeout");
    }
  } catch (err) {
    console.warn("Could not check/seed images in MongoDB:", (err as Error).message);
  }
}
