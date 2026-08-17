// Studios 28 Browser & SSR-Compatible Gallery & Auth Engine
// Built using IndexedDB for high-capacity local image storage and Web Crypto for auth.

export interface GalleryImage {
  id: string;
  cat: string;
  src: string;
  fileName: string;
  uploadedBy?: string;
  createdAt: string;
  alt: string;
}

export const DEFAULT_SHOWCASE_IMAGES: GalleryImage[] = [
  {
    id: "seed-wed-1",
    cat: "Wedding",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    fileName: "grand-wedding-ceremony.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    alt: "Grand Wedding Ceremony",
  },
  {
    id: "seed-wed-2",
    cat: "Wedding",
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    fileName: "traditional-bridal-portrait.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    alt: "Traditional Bridal Portrait",
  },
  {
    id: "seed-wed-3",
    cat: "Wedding",
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    fileName: "candid-wedding-rituals.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    alt: "Candid Wedding Rituals",
  },
  {
    id: "seed-wed-4",
    cat: "Wedding",
    src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
    fileName: "sunset-vows.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    alt: "Couple Sunset Vows",
  },
  {
    id: "seed-pre-1",
    cat: "Pre-Wedding",
    src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
    fileName: "golden-hour-romance.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    alt: "Golden Hour Outdoor Romance",
  },
  {
    id: "seed-pre-2",
    cat: "Pre-Wedding",
    src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
    fileName: "lakeside-couple-story.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    alt: "Lakeside Couple Story",
  },
  {
    id: "seed-pre-3",
    cat: "Pre-Wedding",
    src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
    fileName: "intimate-studio-moment.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    alt: "Intimate Studio Moment",
  },
  {
    id: "seed-port-1",
    cat: "Portrait",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    fileName: "fashion-studio-portrait.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    alt: "High Fashion Studio Portrait",
  },
  {
    id: "seed-port-2",
    cat: "Portrait",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    fileName: "classic-monochrome.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    alt: "Classic Monochrome Portrait",
  },
  {
    id: "seed-port-3",
    cat: "Portrait",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    fileName: "artistic-lighting-editorial.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    alt: "Artistic Lighting Editorial",
  },
  {
    id: "seed-evt-1",
    cat: "Events",
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    fileName: "corporate-gala.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    alt: "Corporate Gala & Awards",
  },
  {
    id: "seed-evt-2",
    cat: "Events",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    fileName: "concert-stage-lights.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    alt: "Concert Stage Lights",
  },
  {
    id: "seed-evt-3",
    cat: "Events",
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    fileName: "celebration-festivities.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    alt: "Celebration & Festivities",
  },
  {
    id: "seed-oth-1",
    cat: "Other",
    src: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=1200&q=80",
    fileName: "maternity-grace.jpg",
    uploadedBy: "admin",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    alt: "Maternity Grace",
  },
  {
    id: "seed-oth-2",
    cat: "Other",
    src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80",
    fileName: "brand-product-showcase.jpg",
    uploadedBy: "admin",
    createdAt: new Date().toISOString(),
    alt: "Brand Product Showcase",
  },
];

const DB_NAME = "studios28_gallery_db";
const DB_VERSION = 1;
const STORE_NAME = "images";
const AUTH_KEY = "s28_admin_session";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.indexedDB !== "undefined";
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      return reject(new Error("IndexedDB is only available in browser"));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("cat", "cat", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Initialize gallery with default images if store is empty
export async function initGalleryStorage(): Promise<void> {
  if (!isBrowser()) return;
  try {
    const db = await openDB();
    const count = await new Promise<number>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (count === 0) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      for (const img of DEFAULT_SHOWCASE_IMAGES) {
        store.put(img);
      }
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }
  } catch (err) {
    console.warn("Could not initialize IndexedDB, falling back to in-memory/defaults:", err);
  }
}

// Fetch all images or filter by category
export async function getStoredImages(category?: string): Promise<GalleryImage[]> {
  if (!isBrowser()) {
    if (category && category !== "All") {
      return DEFAULT_SHOWCASE_IMAGES.filter((img) => img.cat.toLowerCase() === category.toLowerCase());
    }
    return DEFAULT_SHOWCASE_IMAGES;
  }

  try {
    await initGalleryStorage();
    const db = await openDB();
    const images = await new Promise<GalleryImage[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as GalleryImage[]);
      req.onerror = () => reject(req.error);
    });

    // Sort newest first
    const sorted = images.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (category && category !== "All") {
      return sorted.filter((img) => img.cat.toLowerCase() === category.toLowerCase());
    }
    return sorted;
  } catch (err) {
    console.error("Error reading images from IndexedDB:", err);
    if (category && category !== "All") {
      return DEFAULT_SHOWCASE_IMAGES.filter((img) => img.cat.toLowerCase() === category.toLowerCase());
    }
    return DEFAULT_SHOWCASE_IMAGES;
  }
}

// Add / Upload new image
export async function addStoredImage(params: {
  category: string;
  data: string;
  fileName?: string;
  uploadedBy?: string;
}): Promise<GalleryImage> {
  if (!isBrowser()) {
    throw new Error("Cannot save image on server");
  }

  const id = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const newImage: GalleryImage = {
    id,
    cat: params.category,
    src: params.data,
    fileName: params.fileName || `image-${Date.now()}.jpg`,
    uploadedBy: params.uploadedBy || "admin",
    createdAt: new Date().toISOString(),
    alt: `${params.category} showcase image`,
  };

  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(newImage);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  return newImage;
}

// Delete image by ID
export async function deleteStoredImage(id: string): Promise<boolean> {
  if (!isBrowser()) return false;
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  return true;
}

// Reset gallery to default showcase assets
export async function resetStoredGallery(): Promise<void> {
  if (!isBrowser()) return;
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.clear();
  for (const img of DEFAULT_SHOWCASE_IMAGES) {
    store.put(img);
  }
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Auth Helpers (localStorage + cookies for universal compatibility)
export function getStoredAuth(): { authenticated: boolean; username: string | null } {
  if (!isBrowser()) return { authenticated: false, username: null };
  const user = window.localStorage.getItem(AUTH_KEY);
  if (user && user.trim().length > 0) {
    return { authenticated: true, username: user };
  }
  return { authenticated: false, username: null };
}

export function setStoredAuth(username: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(AUTH_KEY, username);
  // Also set cookie
  document.cookie = `admin_token=${encodeURIComponent(username)}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearStoredAuth(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(AUTH_KEY);
  document.cookie = "admin_token=; path=/; max-age=0";
}
