import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { STUDIO } from "../config";
import CallNowButton from "./CallNowButton";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/admin", label: "Admin" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="s28-nav">
      <div className="s28-container s28-nav-inner">
        <Link to="/" className="s28-logo" onClick={() => setOpen(false)}>
          Studios <span>28</span>
        </Link>
        <nav className="s28-nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={path === l.to ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="s28-nav-cta">
          <CallNowButton variant="gold" label="Call Now" />
        </div>
        <button
          className="s28-burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={`s28-mobile ${open ? "open" : ""}`}>
        {LINKS.map((l) => (
          <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <CallNowButton variant="gold" label="Call Now for Pricing" />
      </div>
    </header>
  );
}
