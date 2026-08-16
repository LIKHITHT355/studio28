import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import CallNowButton from "./CallNowButton";
import { STUDIO } from "../config";

const SLIDES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1900&q=70",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1900&q=70",
  "https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=1900&q=70",
];

export default function Hero() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="s28-hero" aria-label="Studios 28 hero">
      {SLIDES.map((src, i) => (
        <img
          key={src}
          className={`s28-hero-slide ${i === idx ? "active" : ""}`}
          src={src}
          alt={`Studios 28 photography showcase ${i + 1}`}
          width={1900}
          height={1267}
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "auto"}
          decoding={i === 0 ? "sync" : "async"}
        />
      ))}
      <div className="s28-container s28-hero-inner">
        <div>
          <span className="s28-eyebrow">Bangalore Photography Studio</span>
          <h1>{STUDIO.tagline}</h1>
          <p>
            Weddings, portraits, and brand imagery — shot with a timeless, editorial eye and
            delivered as heirloom-quality galleries.
          </p>
          <div className="s28-hero-ctas">
            <Link to="/portfolio" className="s28-btn s28-btn-ghost">
              View Portfolio
            </Link>
            <CallNowButton variant="gold" />
          </div>
        </div>
      </div>
    </section>
  );
}
