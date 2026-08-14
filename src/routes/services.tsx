import { createFileRoute } from "@tanstack/react-router";
import PageLayout from "../studio/layouts/PageLayout";
import Services from "../studio/pages/Services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Studios 28 Photography, Bangalore" },
      { name: "description", content: "Wedding, maternity, corporate, portrait, and product photography services in Bangalore. Call for tailored pricing." },
      { property: "og:title", content: "Services — Studios 28 Photography" },
      { property: "og:description", content: "Photography services tailored to your event and story." },
    ],
  }),
  component: () => (
    <PageLayout>
      <Services />
    </PageLayout>
  ),
});