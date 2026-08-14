import { useMemo, useState } from "react";
import GalleryGrid from "../components/GalleryGrid";
import CallNowButton from "../components/CallNowButton";
import { CATEGORIES, GALLERY } from "../config";

export default function Portfolio() {
  const [active, setActive] = useState("All");
  const items = useMemo(
    () => (active === "All" ? GALLERY : GALLERY.filter((g) => g.cat === active)),
    [active]
  );

  return (
    <>
      <section className="s28-page-hero">
        <div className="s28-container">
          <span className="s28-eyebrow">Portfolio</span>
          <h1>A gallery of moments</h1>
          <p>Browse selected work across weddings, portraits, events, and brands. Click any image to view full-screen.</p>
        </div>
      </section>

      <section className="s28-section" style={{ paddingTop: 56 }}>
        <div className="s28-container">
          <div className="s28-filters" role="tablist" aria-label="Portfolio categories">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={active === c}
                className={active === c ? "active" : ""}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <GalleryGrid items={items} masonry />
        </div>
      </section>

      <section className="s28-cta-band">
        <h2>Like what you see?</h2>
        <p>Let's plan a shoot that fits your story.</p>
        <CallNowButton variant="gold" />
      </section>
    </>
  );
}