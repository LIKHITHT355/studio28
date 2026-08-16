import ServiceCard from "../components/ServiceCard";
import CallNowButton from "../components/CallNowButton";
import { SERVICES } from "../config";

export default function Services() {
  return (
    <>
      <section className="s28-page-hero">
        <div className="s28-container">
          <span className="s28-eyebrow">Services</span>
          <h1>Photography, tailored to you</h1>
          <p>
            Every shoot is planned around your story. Call us to design a package that fits your
            event, timeline, and vision.
          </p>
          <div style={{ marginTop: 24 }}>
            <CallNowButton variant="gold" />
          </div>
        </div>
      </section>

      <section className="s28-section">
        <div className="s28-container">
          <div className="s28-services-grid">
            {SERVICES.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>

      <section className="s28-cta-band">
        <h2>Custom pricing for every shoot</h2>
        <p>We don't publish rate cards — every project is unique. Call for a tailored quote.</p>
        <CallNowButton variant="gold" />
      </section>
    </>
  );
}
