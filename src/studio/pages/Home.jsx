import { Link } from "@tanstack/react-router";
import Hero from "../components/Hero";
import GalleryGrid from "../components/GalleryGrid";
import TestimonialCard from "../components/TestimonialCard";
import CallNowButton from "../components/CallNowButton";
import { TESTIMONIALS } from "../config";
import { useQuery } from "@tanstack/react-query";
import { getImages } from "../../lib/actions";

export default function Home() {
  const { data: dbImages, isLoading } = useQuery({
    queryKey: ["images"],
    queryFn: () => getImages(),
  });
  const featured = dbImages ? dbImages.slice(0, 6) : [];
  return (
    <>
      <Hero />

      <section className="s28-section">
        <div className="s28-container s28-intro">
          <div>
            <span className="s28-eyebrow">About the Studio</span>
            <h2>Photography that feels as good as it looks.</h2>
            <p>
              Studios 28 is a boutique photography studio in Bangalore founded on a simple idea:
              your story deserves imagery that lasts. From intimate portraits to grand weddings and
              considered brand campaigns, we approach every shoot with care, craft, and a quiet eye
              for detail.
            </p>
            <p>
              We work closely with each client — from first call to final gallery — so the pictures
              feel like you, not a template.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
              <Link to="/about" className="s28-btn s28-btn-outline">
                Our Story
              </Link>
              <CallNowButton variant="gold" />
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=1200&q=70"
            alt="Studios 28 photographer at work"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      <section className="s28-section" style={{ background: "var(--s28-cream)" }}>
        <div className="s28-container">
          <div className="s28-section-head">
            <span className="s28-eyebrow">Featured Work</span>
            <h2>Selected frames from recent shoots</h2>
            <p>A short look across weddings, portraits, events, and brand work.</p>
          </div>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Loading featured work...</div>
          ) : (
            <GalleryGrid items={featured} />
          )}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link to="/portfolio" className="s28-btn s28-btn-outline">
              View Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="s28-section">
        <div className="s28-container">
          <div className="s28-section-head">
            <span className="s28-eyebrow">Kind Words</span>
            <h2>What our clients say</h2>
          </div>
          <div className="s28-testimonials-grid">
            {TESTIMONIALS.slice(0, 2).map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      <section className="s28-cta-band">
        <h2>Ready to plan your shoot?</h2>
        <p>Every session is custom. Call us for tailored pricing and availability.</p>
        <CallNowButton variant="gold" />
      </section>
    </>
  );
}
