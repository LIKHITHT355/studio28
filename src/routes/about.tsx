import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "../lib/seo";
import PageLayout from "../studio/layouts/PageLayout";
import About from "../studio/pages/About";
export const Route = createFileRoute("/about")({ head: () => pageHead("/about", "About Studios 28 — Bangalore Photography Studio", "Meet the team behind Studios 28, a boutique Bangalore photography studio known for timeless, editorial wedding and portrait photography."), component: () => <PageLayout><About /></PageLayout> });
