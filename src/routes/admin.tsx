import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginAdmin,
  logoutAdmin,
  checkAuth,
  uploadImage,
  getImages,
  deleteImage,
  resetGallery,
} from "../lib/actions";
import PageLayout from "../studio/layouts/PageLayout";
import { CATEGORIES } from "../studio/config";
import {
  Lock,
  User,
  LogOut,
  UploadCloud,
  Trash2,
  Image as ImageIcon,
  Filter,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Calendar,
  UserCheck,
  RotateCcw,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Studios 28" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { data: auth, isLoading: authLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: () => checkAuth(),
  });

  if (authLoading) {
    return (
      <PageLayout>
        <div
          style={{
            minHeight: "80vh",
            display: "grid",
            placeItems: "center",
            background: "#0f0e0d",
            color: "#e6e0d6",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                border: "3px solid #332f2b",
                borderTopColor: "#b8975a",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <p
              style={{
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontSize: 13,
                color: "#a89f91",
              }}
            >
              Checking Authentication...
            </p>
          </div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div
        style={{
          minHeight: "85vh",
          background: "#11100e",
          color: "#f7f5f0",
          padding: "40px 16px 80px",
        }}
      >
        {!auth?.authenticated ? (
          <LoginForm />
        ) : (
          <AdminDashboard username={auth.username || "Admin"} />
        )}
      </div>
    </PageLayout>
  );
}

function LoginForm() {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => loginAdmin({ data: { username, password } }),
    onSuccess: () => {
      setError("");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (err: Error) => {
      setError(err.message || "Invalid credentials. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter both username and password");
      return;
    }
    setError("");
    loginMutation.mutate();
  };

  return (
    <div style={{ maxWidth: 440, margin: "60px auto 0", padding: 0 }}>
      <div
        style={{
          background: "#181614",
          border: "1px solid #2e2924",
          borderRadius: 12,
          padding: "40px 32px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #8a6d3b, #b8975a, #e4c789)",
          }}
        />

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(184, 151, 90, 0.12)",
              border: "1px solid rgba(184, 151, 90, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#b8975a",
              marginBottom: 16,
            }}
          >
            <Lock size={24} />
          </div>
          <h2
            style={{
              fontFamily: "var(--s28-serif, serif)",
              fontSize: "1.9rem",
              margin: 0,
              color: "#fff",
            }}
          >
            Admin Portal
          </h2>
          <p style={{ color: "#9a9184", fontSize: "0.9rem", marginTop: 6 }}>
            Sign in to manage Studios 28 portfolio assets
          </p>
          <div
            style={{
              display: "inline-block",
              marginTop: 10,
              padding: "4px 10px",
              background: "rgba(184, 151, 90, 0.1)",
              border: "1px solid rgba(184, 151, 90, 0.25)",
              borderRadius: 4,
              fontSize: 12,
              color: "#d4af37",
            }}
          >
            Default credentials: <strong>admin</strong> / <strong>changeme</strong>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(220, 38, 38, 0.12)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              color: "#fca5a5",
              padding: "12px 14px",
              borderRadius: 6,
              marginBottom: 20,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#a89f91",
                marginBottom: 8,
              }}
            >
              Username
            </label>
            <div style={{ position: "relative" }}>
              <User
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b625a",
                }}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: 6,
                  border: "1px solid #332e28",
                  background: "#12110f",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#a89f91",
                marginBottom: 8,
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b625a",
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: 6,
                  border: "1px solid #332e28",
                  background: "#12110f",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            style={{
              padding: "14px",
              borderRadius: 6,
              background: "linear-gradient(135deg, #b8975a, #8a6d3b)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              border: "none",
              cursor: loginMutation.isPending ? "not-allowed" : "pointer",
              opacity: loginMutation.isPending ? 0.7 : 1,
              marginTop: 6,
              transition: "transform 0.15s, opacity 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loginMutation.isPending ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid #fff",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ username }: { username: string }) {
  const queryClient = useQueryClient();
  const [selectedUploadCategory, setSelectedUploadCategory] = useState("Wedding");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available categories for upload (excluding "All")
  const uploadCategories = useMemo(() => CATEGORIES.filter((c) => c !== "All"), []);

  const { data: images, isLoading: imagesLoading } = useQuery({
    queryKey: ["images"],
    queryFn: () => getImages(),
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutAdmin(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ base64, fileName }: { base64: string; fileName: string }) =>
      uploadImage({
        data: {
          category: selectedUploadCategory,
          data: base64,
          fileName,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadError(null);
      setUploadSuccess("Image successfully uploaded and added to the gallery!");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setUploadSuccess(null), 4500);
    },
    onError: (err: Error) => {
      setUploadError(err.message || "Failed to upload image. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteImage({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
    onError: (err: Error) => {
      alert(err.message || "Failed to delete image.");
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => resetGallery(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      setUploadSuccess("Gallery has been reset to default showcase imagery.");
      setTimeout(() => setUploadSuccess(null), 4000);
    },
    onError: (err: Error) => {
      alert(err.message || "Failed to reset gallery.");
    },
  });

  const handleFileSelection = (file: File | null) => {
    setUploadError(null);
    setUploadSuccess(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Invalid format. Please select a JPG, PNG, or WebP image.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum allowed is 5MB.`,
      );
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile || !previewUrl) return;
    setUploadError(null);
    uploadMutation.mutate({
      base64: previewUrl,
      fileName: selectedFile.name,
    });
  };

  const filteredImages = useMemo(() => {
    if (!images) return [];
    if (activeFilter === "All") return images;
    return images.filter((img) => img.cat.toLowerCase() === activeFilter.toLowerCase());
  }, [images, activeFilter]);

  const categoryCounts = useMemo(() => {
    if (!images) return {};
    const counts: Record<string, number> = { All: images.length };
    images.forEach((img) => {
      counts[img.cat] = (counts[img.cat] || 0) + 1;
    });
    return counts;
  }, [images]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          padding: "20px 24px",
          background: "#181614",
          border: "1px solid #2e2924",
          borderRadius: 12,
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: "rgba(184, 151, 90, 0.15)",
              border: "1px solid rgba(184, 151, 90, 0.3)",
              display: "grid",
              placeItems: "center",
              color: "#b8975a",
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "var(--s28-serif, serif)",
                fontSize: "1.7rem",
                margin: 0,
                color: "#fff",
              }}
            >
              Studio 28 Asset Management
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  color: "#9a9184",
                  fontSize: 13,
                }}
              >
                <UserCheck size={14} color="#b8975a" /> Logged in as{" "}
                <strong style={{ color: "#e4c789" }}>{username}</strong>
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Reset gallery to original showcase images? This will restore all default portfolio assets.",
                )
              ) {
                resetMutation.mutate();
              }
            }}
            disabled={resetMutation.isPending}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 6,
              background: "#24201c",
              border: "1px solid #3d362f",
              color: "#c7bfb5",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <RotateCcw size={15} />
            <span>{resetMutation.isPending ? "Resetting..." : "Reset Defaults"}</span>
          </button>

          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 6,
              background: "#24201c",
              border: "1px solid #3d362f",
              color: "#e6e0d6",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <LogOut size={16} />
            <span>{logoutMutation.isPending ? "Logging out..." : "Sign Out"}</span>
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div
        style={{
          background: "#181614",
          border: "1px solid #2e2924",
          borderRadius: 12,
          padding: "28px 28px 32px",
          marginBottom: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <UploadCloud size={20} color="#b8975a" />
          <h2
            style={{
              fontFamily: "var(--s28-serif, serif)",
              fontSize: "1.4rem",
              margin: 0,
              color: "#fff",
            }}
          >
            Upload New Showcase Image
          </h2>
        </div>

        {uploadSuccess && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#6ee7b7",
              padding: "12px 16px",
              borderRadius: 6,
              marginBottom: 20,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {uploadError && (
          <div
            style={{
              background: "rgba(220, 38, 38, 0.12)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              color: "#fca5a5",
              padding: "12px 16px",
              borderRadius: 6,
              marginBottom: 20,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{uploadError}</span>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Form Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#a89f91",
                  marginBottom: 8,
                }}
              >
                Category
              </label>
              <select
                value={selectedUploadCategory}
                onChange={(e) => setSelectedUploadCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 6,
                  border: "1px solid #38322b",
                  background: "#12110f",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {uploadCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#a89f91",
                  marginBottom: 8,
                }}
              >
                Select Image File (JPG, PNG, WebP — Max 5MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                ref={fileInputRef}
                onChange={(e) => handleFileSelection(e.target.files?.[0] || null)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px dashed #473e35",
                  background: "#141210",
                  color: "#c7bfb5",
                  fontSize: 13,
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "14px 24px",
                borderRadius: 6,
                background:
                  selectedFile && !uploadMutation.isPending
                    ? "linear-gradient(135deg, #b8975a, #8a6d3b)"
                    : "#2a2520",
                color: selectedFile && !uploadMutation.isPending ? "#fff" : "#6b625a",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "none",
                cursor: selectedFile && !uploadMutation.isPending ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                marginTop: 6,
              }}
            >
              {uploadMutation.isPending ? (
                <>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid #fff",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <span>Uploading to Database...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Upload & Publish</span>
                </>
              )}
            </button>
          </div>

          {/* Preview Panel */}
          <div
            style={{
              border: "1px solid #2e2924",
              borderRadius: 8,
              background: "#12110f",
              padding: 16,
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {previewUrl ? (
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxHeight: 200,
                    overflow: "hidden",
                    borderRadius: 6,
                    marginBottom: 12,
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Upload preview"
                    style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.75)",
                      color: "#e4c789",
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {selectedUploadCategory}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#9a9184" }}>
                  {selectedFile?.name} ({((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div style={{ color: "#6b625a", padding: "24px 0" }}>
                <ImageIcon size={36} style={{ marginBottom: 8, opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: 13 }}>Image preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Image Manager */}
      <div
        style={{
          background: "#181614",
          border: "1px solid #2e2924",
          borderRadius: 12,
          padding: "28px 28px 36px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 24,
            borderBottom: "1px solid #29241f",
            paddingBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--s28-serif, serif)",
                fontSize: "1.5rem",
                margin: 0,
                color: "#fff",
              }}
            >
              Manage Gallery Assets
            </h2>
            <p style={{ color: "#9a9184", fontSize: 13, margin: "4px 0 0" }}>
              Total {images?.length || 0} images in database
            </p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: "#9a9184",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginRight: 4,
              }}
            >
              <Filter size={14} /> Filter:
            </span>
            {CATEGORIES.map((c) => {
              const count = categoryCounts[c] || 0;
              const isActive = activeFilter.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  onClick={() => setActiveFilter(c)}
                  style={{
                    background: isActive ? "#b8975a" : "#24201c",
                    color: isActive ? "#111" : "#c7bfb5",
                    border: `1px solid ${isActive ? "#b8975a" : "#38322b"}`,
                    padding: "6px 14px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>{c}</span>
                  <span
                    style={{
                      fontSize: 10,
                      opacity: 0.8,
                      background: isActive ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.08)",
                      padding: "1px 5px",
                      borderRadius: 10,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {imagesLoading ? (
          <div style={{ padding: "60px 0", textAlign: "center", color: "#9a9184" }}>
            <div
              style={{
                width: 28,
                height: 28,
                border: "2px solid #332f2b",
                borderTopColor: "#b8975a",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            <p style={{ fontSize: 14 }}>Loading showcase images...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              background: "#13110f",
              borderRadius: 8,
              border: "1px dashed #332d26",
            }}
          >
            <ImageIcon size={44} style={{ color: "#4f463c", marginBottom: 12 }} />
            <h3
              style={{
                fontFamily: "var(--s28-serif, serif)",
                fontSize: "1.25rem",
                color: "#d9d2c5",
                margin: "0 0 6px",
              }}
            >
              No images found in category "{activeFilter}"
            </h3>
            <p style={{ color: "#8a8174", fontSize: 13, margin: 0 }}>
              Use the upload tool above to add photography assets to this category.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {filteredImages.map((img) => (
              <div
                key={img.id}
                style={{
                  background: "#12110f",
                  border: "1px solid #2e2822",
                  borderRadius: 8,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    position: "relative",
                    height: 180,
                    overflow: "hidden",
                    background: "#0a0908",
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt || img.fileName}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.3s ease",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "rgba(18, 16, 14, 0.85)",
                      backdropFilter: "blur(4px)",
                      color: "#e4c789",
                      padding: "3px 8px",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      border: "1px solid rgba(184, 151, 90, 0.3)",
                    }}
                  >
                    {img.cat}
                  </span>
                </div>

                {/* Card Details & Actions */}
                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    flex: 1,
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      title={img.fileName}
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#f0ebe1",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {img.fileName || "image.jpg"}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        marginTop: 4,
                        fontSize: 11,
                        color: "#8a8174",
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <UserCheck size={11} /> {img.uploadedBy || "admin"}
                      </span>
                      {img.createdAt && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                          <Calendar size={11} /> {new Date(img.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: 10,
                      borderTop: "1px solid #231f1a",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <a
                      href={img.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 12,
                        color: "#b8975a",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      View Full Size ↗
                    </a>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to permanently delete "${img.fileName || "this image"}"?`,
                          )
                        ) {
                          deleteMutation.mutate(img.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        background: "rgba(220, 38, 38, 0.12)",
                        color: "#f87171",
                        border: "1px solid rgba(220, 38, 38, 0.25)",
                        borderRadius: 4,
                        padding: "6px 10px",
                        fontSize: 11,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
