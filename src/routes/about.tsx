import { createFileRoute } from "@tanstack/react-router";
import PageLayout from "../studio/layouts/PageLayout";
import About from "../studio/pages/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Studios 28, Bangalore Photography Studio" },
      {
        name: "description",
        content:
          "Studios 28 is a boutique photography studio in Bangalore. Meet the team and see our story.",
      },
      { property: "og:title", content: "About Studios 28" },
      {
        property: "og:description",
        content: "The story behind Bangalore's Studios 28 photography studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About — Studios 28, Bangalore Photography Studio" },
      {
        name: "twitter:description",
        content: "The story behind Bangalore's Studios 28 photography studio.",
      },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: () => (
    <PageLayout>
      <About />
    </PageLayout>
  ),
});
