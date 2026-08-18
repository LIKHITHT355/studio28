import mongoose, { Model } from "mongoose";

// Universal MongoDB URI extraction across local dev, Vite, SSR, and Cloudflare Workers
function getMongoUri(): string {
  let uri =
    process.env.MONGODB_URI ||
    (typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.MONGODB_URI || import.meta.env.VITE_MONGODB_URI
      : undefined) ||
    (globalThis as Record<string, unknown>).MONGODB_URI ||
    (globalThis as { process?: { env?: Record<string, string> } })?.process?.env?.MONGODB_URI;

  // If process.env wasn't populated in long-running dev server, read directly from .env on disk
  if (!uri && typeof process !== "undefined" && process.cwd) {
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
            const key = trimmed.substring(0, idx).trim();
            const val = trimmed.substring(idx + 1).trim();
            if (key === "MONGODB_URI") {
              uri = val;
              process.env.MONGODB_URI = val;
              break;
            }
          }
        }
      }
    } catch {
      // Ignore in worker environment
    }
  }

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

// Timeout wrapper to guarantee Worker and server calls never hang indefinitely
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = getMongoUri();
  if (!uri) {
    console.warn("MONGODB_URI not found in environment or .env file.");
    return null;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Reset promise if previous attempt was closed or disconnected
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached.promise = null;
    cached.conn = null;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "studios28",
      autoIndex: false,
      // Do not pre-warm connections in a Worker, but retain enough capacity
      // for the upload save and concurrent gallery reads. A pool of five with
      // a 10s wait queue caused real uploads to fail at checkout under load.
      maxPoolSize: 20,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 60000,
      waitQueueTimeoutMS: 30000,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      console.log("Connected to MongoDB Atlas (studios28)");
      return m;
    });
  }

  try {
    cached.conn = await withTimeout(cached.promise, 10000, "MongoDB connection timed out after 10s");
    return cached.conn;
  } catch (e) {
    console.error("MongoDB connection failed:", (e as Error).message);
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
  imageFileId?: string;
  fileName: string;
  uploadedBy: string;
  createdAt: Date;
}

const ImageSchema = new mongoose.Schema<IImage>({
  category: { type: String, required: true, index: true },
  data: { type: String, required: true },
  imageFileId: { type: String },
  fileName: { type: String, default: "image.jpg" },
  uploadedBy: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now, index: true },
});

export const Image: Model<IImage> =
  (mongoose.models.Image as Model<IImage>) || mongoose.model<IImage>("Image", ImageSchema);

/**
 * Run one gallery operation using a connection owned by the current request.
 * Cloudflare Workers must not reuse database I/O created by a previous request;
 * the global Mongoose cache above is retained only for non-gallery legacy code.
 */
export async function withImageDatabase<T>(
  operation: (image: Model<IImage>) => Promise<T>
): Promise<T> {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error("MONGODB_URI not found in environment or .env file.");
  }

  const connection = mongoose.createConnection(uri, {
    dbName: "studios28",
    autoIndex: false,
    bufferCommands: false,
    maxPoolSize: 1,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    waitQueueTimeoutMS: 15000,
    family: 4,
  });

  try {
    await withTimeout(
      connection.asPromise(),
      20000,
      "MongoDB connection timed out after 20 seconds"
    );
    const image =
      (connection.models.Image as Model<IImage>) ||
      connection.model<IImage>("Image", ImageSchema);
    return await operation(image);
  } finally {
    await connection.close().catch((err) => {
      console.warn("MongoDB request connection close failed:", (err as Error).message);
    });
  }
}

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

// Seed images helper (disabled from auto-running; available only if manually called)
export async function seedImagesIfEmpty(): Promise<void> {
  // No-op: Auto-seeding is disabled so only authentic database records are served.
}
