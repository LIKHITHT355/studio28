import { createFileRoute } from "@tanstack/react-router";
import PageLayout from "../studio/layouts/PageLayout";
import Contact from "../studio/pages/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Booking — Studios 28 Bangalore" },
      {
        name: "description",
        content:
          "Book a photography session with Studios 28 in Bangalore. Call, email, or send an enquiry.",
      },
      { property: "og:title", content: "Contact Studios 28" },
      {
        property: "og:description",
        content: "Get in touch to plan your shoot with Studios 28 in Bangalore.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contact & Booking — Studios 28 Bangalore" },
      {
        name: "twitter:description",
        content: "Get in touch to plan your shoot with Studios 28 in Bangalore.",
      },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: () => (
    <PageLayout>
      <Contact />
    </PageLayout>
  ),
});
