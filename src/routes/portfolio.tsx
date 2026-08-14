import { createFileRoute } from "@tanstack/react-router";
import PageLayout from "../studio/layouts/PageLayout";
import Portfolio from "../studio/pages/Portfolio";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Studios 28 Bangalore" },
      { name: "description", content: "Browse selected wedding, portrait, event, and product photography by Studios 28 in Bangalore." },
      { property: "og:title", content: "Portfolio — Studios 28 Bangalore" },
      { property: "og:description", content: "Selected photography work across weddings, portraits, events, and brands." },
    ],
  }),
  component: () => (
    <PageLayout>
      <Portfolio />
    </PageLayout>
  ),
});