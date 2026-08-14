import { useState } from "react";
import CallNowButton from "../components/CallNowButton";
import { STUDIO } from "../config";

const EVENT_TYPES = ["Wedding", "Pre-Wedding", "Maternity", "Portrait", "Corporate / Event", "Product", "Other"];

export default function Contact() {
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", msg: "" });
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      // TODO: replace with your Web3Forms / Formspree endpoint
      const endpoint = "https://api.web3forms.com/submit";
      const res = await fetch(endpoint, { method: "POST", body: data });
      if (!res.ok) throw new Error("Request failed");
      setStatus({ state: "ok", msg: "Thanks — we'll get back to you within 24 hours." });
      form.reset();
    } catch (err) {
      setStatus({ state: "err", msg: "Something went wrong. Please call or email us directly." });
    }
  }

  return (
    <>
      <section className="s28-page-hero">
        <div className="s28-container">
          <span className="s28-eyebrow">Contact & Booking</span>
          <h1>Let's plan your shoot</h1>
          <p>Call us for tailored pricing and availability, or send an enquiry — we reply within 24 hours.</p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <CallNowButton variant="gold" label={`Call ${STUDIO.phone}`} />
            <a className="s28-btn s28-btn-outline" href={`mailto:${STUDIO.email}`}>Email Us</a>
          </div>
        </div>
      </section>

      <section className="s28-section">
        <div className="s28-container s28-contact-grid">
          <form className="s28-form" onSubmit={handleSubmit}>
            <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_KEY" />
            <input type="hidden" name="subject" value="New enquiry — Studios 28" />
            <input type="text" name="botcheck" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

            <div className="s28-form-row">
              <div className="s28-field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" required maxLength={100} />
              </div>
              <div className="s28-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required maxLength={255} />
              </div>
            </div>
            <div className="s28-form-row">
              <div className="s28-field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" required maxLength={20} />
              </div>
              <div className="s28-field">
                <label htmlFor="event_type">Event Type</label>
                <select id="event_type" name="event_type" defaultValue="">
                  <option value="" disabled>Select…</option>
                  {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="s28-form-row">
              <div className="s28-field">
                <label htmlFor="event_date">Event Date</label>
                <input id="event_date" name="event_date" type="date" />
              </div>
              <div className="s28-field">
                <label htmlFor="location">Location</label>
                <input id="location" name="location" type="text" maxLength={200} placeholder="Bangalore" />
              </div>
            </div>
            <div className="s28-field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" maxLength={1000} placeholder="Tell us about your shoot…" />
            </div>
            <button type="submit" className="s28-btn s28-btn-primary" disabled={status.state === "loading"}>
              {status.state === "loading" ? "Sending…" : "Send Enquiry"}
            </button>
            {status.state === "ok" && <div className="s28-alert">{status.msg}</div>}
            {status.state === "err" && <div className="s28-alert err">{status.msg}</div>}
          </form>

          <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="s28-contact-info">
              <div className="s28-contact-info-item">
                <span className="s28-label">Call</span>
                <a className="s28-value" href={`tel:${STUDIO.phoneHref}`}>{STUDIO.phone}</a>
              </div>
              <div className="s28-contact-info-item">
                <span className="s28-label">Email</span>
                <a className="s28-value" href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a>
              </div>
              <div className="s28-contact-info-item">
                <span className="s28-label">Studio</span>
                <span className="s28-value">{STUDIO.city}</span>
              </div>
              <a
                className="s28-btn s28-btn-gold"
                href={`https://wa.me/${STUDIO.whatsappHref}`}
                target="_blank"
                rel="noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>
            <iframe
              className="s28-map"
              title="Studios 28 location — Bangalore"
              src={STUDIO.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </aside>
        </div>
      </section>
    </>
  );
}