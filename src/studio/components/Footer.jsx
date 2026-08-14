import { Link } from "@tanstack/react-router";
import { STUDIO } from "../config";

function Icon({ children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="s28-footer">
      <div className="s28-container">
        <div className="s28-footer-grid">
          <div>
            <div className="s28-logo" style={{ color: "#fff", marginBottom: 12 }}>
              Studios <span style={{ color: "var(--s28-gold)" }}>28</span>
            </div>
            <p style={{ color: "#a29a90", maxWidth: 320 }}>
              A Bangalore-based photography studio capturing weddings, portraits,
              and brand stories with a timeless, editorial eye.
            </p>
            <div className="s28-socials">
              <a href={STUDIO.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
                <Icon><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></Icon>
              </a>
              <a href={STUDIO.facebook} aria-label="Facebook" target="_blank" rel="noreferrer">
                <Icon><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></Icon>
              </a>
              <a href={`https://wa.me/${STUDIO.whatsappHref}`} aria-label="WhatsApp" target="_blank" rel="noreferrer">
                <Icon><path d="M21 11.5a8.5 8.5 0 1 1-16.06-3.94L3 21l6.44-1.94A8.5 8.5 0 0 0 21 11.5z" /></Icon>
              </a>
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Studio</h4>
            <ul>
              <li>{STUDIO.city}</li>
              <li>By appointment</li>
              <li>Mon–Sat, 10am–7pm</li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href={`tel:${STUDIO.phoneHref}`}>{STUDIO.phone}</a></li>
              <li><a href={`mailto:${STUDIO.email}`}>{STUDIO.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="s28-footer-bottom">
          © {new Date().getFullYear()} Studios 28 · All rights reserved
        </div>
      </div>
    </footer>
  );
}