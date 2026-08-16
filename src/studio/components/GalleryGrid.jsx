import { useEffect, useState } from "react";
import ImageCard from "./ImageCard";

export default function GalleryGrid({ items, masonry = false }) {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, items.length]);

  const cls = masonry ? "s28-gallery" : "s28-featured-grid";

  return (
    <>
      <div className={cls}>
        {items.map((it, i) => (
          <ImageCard
            key={it.id}
            src={it.src}
            alt={it.alt}
            label={it.cat}
            onClick={() => setOpen(i)}
          />
        ))}
      </div>
      {open !== null && items[open] && (
        <div className="s28-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
          <button className="s28-lightbox-close" onClick={() => setOpen(null)} aria-label="Close">
            ×
          </button>
          <button
            className="s28-lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((i) => (i - 1 + items.length) % items.length);
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <img src={items[open].src} alt={items[open].alt} onClick={(e) => e.stopPropagation()} />
          <button
            className="s28-lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((i) => (i + 1) % items.length);
            }}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
