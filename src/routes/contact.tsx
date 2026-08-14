import { createFileRoute } from "@tanstack/react-router";
import PageLayout from "../studio/layouts/PageLayout";
import Contact from "../studio/pages/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Booking — Studios 28 Bangalore" },
      { name: "description", content: "Book a photography session with Studios 28 in Bangalore. Call, email, or send an enquiry." },
      { property: "og:title", content: "Contact Studios 28" },
      { property: "og:description", content: "Get in touch to plan your shoot with Studios 28 in Bangalore." },
    ],
  }),
  component: () => (
    <PageLayout>
      <Contact />
    </PageLayout>
  ),
});