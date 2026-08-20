import { useState } from "react";
import CallNowButton from "../components/CallNowButton";
import { STUDIO } from "../config";

const EVENT_TYPES = [
  "Wedding",
  "Pre-Wedding",
  "Maternity",
  "Portrait",
  "Corporate / Event",
  "Product",
  "Other",
];

export default function Contact() {
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  function handleSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", msg: "" });

    const form = e.currentTarget;
    const data = new FormData(form);

    const name = data.get("name")?.toString().trim() || "";
    const email = data.get("email")?.toString().trim() || "";
    const phone = data.get("phone")?.toString().trim() || "";
    const eventType = data.get("event_type")?.toString().trim() || "Not specified";
    const eventDate = data.get("event_date")?.toString().trim() || "Flexible / Not decided";
    const location = data.get("location")?.toString().trim() || "Bangalore";
    const message = data.get("message")?.toString().trim() || "";

    const textParts = [
      `*New Shoot Enquiry — Studios 28*`,
      ``,
      `👤 *Name:* ${name}`,
      `📞 *Phone:* ${phone}`,
      email ? `📧 *Email:* ${email}` : null,
      `📸 *Event Type:* ${eventType}`,
      `📅 *Event Date:* ${eventDate}`,
      `📍 *Location:* ${location}`,
      message ? `\n💬 *Message:*\n${message}` : null,
    ].filter(Boolean);

    const whatsappText = encodeURIComponent(textParts.join("\n"));
    const whatsappUrl = `https://wa.me/${STUDIO.whatsappHref}?text=${whatsappText}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setStatus({
      state: "ok",
      msg: "Opening WhatsApp with your enquiry details. If it didn't open automatically, please click below.",
    });
  }

  return (
    <>
      <section className="s28-page-hero">
        <div className="s28-container">
          <span className="s28-eyebrow">Contact & Booking</span>
          <h1>Book photography in Bangalore</h1>
          <p>
            Call us for tailored pricing and availability, or send an enquiry — we reply within 24
            hours.
          </p>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <CallNowButton variant="gold" label={`Call ${STUDIO.phone}`} />
            <a className="s28-btn s28-btn-outline" href={`mailto:${STUDIO.email}`}>
              Email Us
            </a>
          </div>
        </div>
      </section>

      <section className="s28-section">
        <div className="s28-container s28-contact-grid">
          <form className="s28-form" onSubmit={handleSubmit}>
            <div className="s28-form-row">
              <div className="s28-field">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Your name"
                />
              </div>
              <div className="s28-field">
                <label htmlFor="phone">Phone *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  maxLength={20}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div className="s28-form-row">
              <div className="s28-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  maxLength={255}
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="s28-field">
                <label htmlFor="event_type">Event Type</label>
                <select id="event_type" name="event_type" defaultValue="Wedding">
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
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
                <input
                  id="location"
                  name="location"
                  type="text"
                  maxLength={200}
                  placeholder="Bangalore"
                />
              </div>
            </div>
            <div className="s28-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                maxLength={1000}
                placeholder="Tell us about your shoot, expectations, and any questions…"
              />
            </div>
            <button
              type="submit"
              className="s28-btn"
              style={{
                background: "#25D366",
                color: "#ffffff",
                border: "none",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "14px 28px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 32 32"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19.11 17.42c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.68-.51l-.58-.01a1.1 1.1 0 0 0-.8.37c-.28.3-1.06 1.04-1.06 2.53s1.09 2.94 1.24 3.14c.15.2 2.14 3.27 5.2 4.58.73.31 1.29.5 1.73.64.73.23 1.4.2 1.92.12.59-.09 1.77-.72 2.03-1.42.25-.7.25-1.29.17-1.42-.07-.13-.28-.2-.58-.35zM16.03 4C9.4 4 4 9.38 4 16c0 2.11.56 4.15 1.6 5.94L4 28l6.24-1.64A11.94 11.94 0 0 0 16.03 28C22.67 28 28 22.62 28 16S22.67 4 16.03 4z" />
              </svg>
              <span>Send Enquiry on WhatsApp</span>
            </button>
            {status.state === "ok" && <div className="s28-alert">{status.msg}</div>}
            {status.state === "err" && <div className="s28-alert err">{status.msg}</div>}
          </form>

          <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="s28-contact-info">
              <div className="s28-contact-info-item">
                <span className="s28-label">Call</span>
                <a className="s28-value" href={`tel:${STUDIO.phoneHref}`}>
                  {STUDIO.phone}
                </a>
              </div>
              <div className="s28-contact-info-item">
                <span className="s28-label">Email</span>
                <a className="s28-value" href={`mailto:${STUDIO.email}`}>
                  {STUDIO.email}
                </a>
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
