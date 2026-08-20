import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "../lib/seo";
import PageLayout from "../studio/layouts/PageLayout";
import Portfolio from "../studio/pages/Portfolio";
export const Route = createFileRoute("/portfolio")({ head: () => pageHead("/portfolio", "Photography Portfolio — Weddings & Portraits | Studios 28 Bangalore", "Browse real wedding, portrait, maternity and brand photography shot in Bangalore by Studios 28. See our editorial style across recent shoots."), component: () => <PageLayout><Portfolio /></PageLayout> });
