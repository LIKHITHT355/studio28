import { createFileRoute } from "@tanstack/react-router";
import PageLayout from "../studio/layouts/PageLayout";
import Home from "../studio/pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studios 28 — Bangalore Photography Studio" },
      { name: "description", content: "Studios 28 is a Bangalore-based photography studio for weddings, portraits, events, and brand imagery. Call now for tailored pricing." },
      { property: "og:title", content: "Studios 28 — Bangalore Photography Studio" },
      { property: "og:description", content: "Weddings, portraits, and brand stories, captured in Bangalore." },
    ],
  }),
  component: () => (
    <PageLayout>
      <Home />
    </PageLayout>
  ),
});
