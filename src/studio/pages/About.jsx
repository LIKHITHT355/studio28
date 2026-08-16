import CallNowButton from "../components/CallNowButton";

const STATS = [
  { n: "12+", l: "Years shooting" },
  { n: "400+", l: "Weddings covered" },
  { n: "1,200+", l: "Happy clients" },
  { n: "20+", l: "Awards & features" },
];

const BTS = [
  {
    id: "1552168324-d612d77725e3",
    alt: "Studios 28 team setting up lighting for a portrait session",
  },
  {
    id: "1520854221256-17451cc331bf",
    alt: "Photographer reviewing shots on camera during a wedding shoot",
  },
  { id: "1554080353-a576cf803bda", alt: "Creative direction and styling at Studios 28 studio" },
];

export default function About() {
  return (
    <>
      <section className="s28-page-hero">
        <div className="s28-container">
          <span className="s28-eyebrow">Our Story</span>
          <h1>Bangalore's quiet corner for beautiful photography</h1>
        </div>
      </section>

      <section className="s28-section">
        <div className="s28-container s28-about-hero">
          <img
            src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=1200&q=70"
            alt="Behind the scenes at Studios 28"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
          />
          <div>
            <span className="s28-eyebrow">About Studios 28</span>
            <h2>We chase soft light, real emotion, and honest moments.</h2>
            <p>
              Founded in Bangalore, Studios 28 began as a small passion project between friends who
              loved film cameras and long shoots. Today, we're a full-service studio serving
              couples, families, and brands across Karnataka and beyond.
            </p>
            <p>
              Our approach is calm, considered, and collaborative — because the best pictures happen
              when everyone feels at ease.
            </p>
          </div>
        </div>
      </section>

      <section className="s28-section" style={{ paddingTop: 0 }}>
        <div className="s28-container">
          <div className="s28-stats">
            {STATS.map((s) => (
              <div key={s.l}>
                <div className="s28-stat-num">{s.n}</div>
                <div className="s28-stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="s28-section" style={{ background: "var(--s28-cream)" }}>
        <div className="s28-container">
          <div className="s28-section-head">
            <span className="s28-eyebrow">Featured In</span>
            <h2>Recognition & press</h2>
            <p>A small selection of publications and awards our work has been featured in.</p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
              textAlign: "center",
              color: "var(--s28-muted)",
              fontFamily: "var(--s28-serif)",
              fontSize: "1.4rem",
            }}
          >
            <div>WedMeGood</div>
            <div>WeddingSutra</div>
            <div>Vogue India</div>
            <div>Better Photography</div>
          </div>
        </div>
      </section>

      <section className="s28-section">
        <div className="s28-container">
          <div className="s28-section-head">
            <span className="s28-eyebrow">Behind the Scenes</span>
            <h2>The team at work</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {BTS.map((item) => (
              <div key={item.id} className="s28-tile" style={{ aspectRatio: "3/4" }}>
                <img
                  src={`https://images.unsplash.com/photo-${item.id}?auto=format&fit=crop&w=800&q=70`}
                  alt={item.alt}
                  width={800}
                  height={1067}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
