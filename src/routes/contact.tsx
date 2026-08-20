import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "../lib/seo";
import PageLayout from "../studio/layouts/PageLayout";
import Contact from "../studio/pages/Contact";
export const Route = createFileRoute("/contact")({ head: () => pageHead("/contact", "Contact Studios 28 — Book a Photography Session in Bangalore", "Get in touch with Studios 28 to book your wedding, portrait, or brand photography session in Bangalore. Call, WhatsApp, or email us today."), component: () => <PageLayout><Contact /></PageLayout> });
