import { createFileRoute } from "@tanstack/react-router";
import PageLayout from "../studio/layouts/PageLayout";
import Services from "../studio/pages/Services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Studios 28 Photography, Bangalore" },
      {
        name: "description",
        content:
          "Wedding, maternity, corporate, portrait, and product photography services in Bangalore. Call for tailored pricing.",
      },
      { property: "og:title", content: "Services — Studios 28 Photography" },
      {
        property: "og:description",
        content: "Photography services tailored to your event and story.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Services — Studios 28 Photography, Bangalore" },
      {
        name: "twitter:description",
        content: "Photography services tailored to your event and story.",
      },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: () => (
    <PageLayout>
      <Services />
    </PageLayout>
  ),
});
