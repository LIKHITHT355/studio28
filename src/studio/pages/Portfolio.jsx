import { useMemo, useState } from "react";
import GalleryGrid from "../components/GalleryGrid";
import CallNowButton from "../components/CallNowButton";
import { CATEGORIES } from "../config";
import { useQuery } from "@tanstack/react-query";
import { getImages } from "../../lib/actions";

export default function Portfolio() {
  const [active, setActive] = useState("All");

  const { data: dbImages, isLoading } = useQuery({
    queryKey: ["images"],
    queryFn: () => getImages(),
  });

  const items = useMemo(() => {
    const allItems = dbImages || [];
    return active === "All" ? allItems : allItems.filter((g) => g.cat?.toLowerCase() === active.toLowerCase());
  }, [active, dbImages]);

  return (
    <>
      <section className="s28-page-hero">
        <div className="s28-container">
          <span className="s28-eyebrow">Portfolio</span>
          <h1>Bangalore photography portfolio</h1>
          <p>
            Browse selected work across weddings, portraits, events, and brands. Click any image to
            view full-screen.
          </p>
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
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Loading gallery...</div>
          ) : (
            <GalleryGrid items={items} masonry />
          )}
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
