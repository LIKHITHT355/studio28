import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "../lib/seo";
import PageLayout from "../studio/layouts/PageLayout";
import Home from "../studio/pages/Home";
export const Route = createFileRoute("/")({ head: () => pageHead("/", "Wedding & Portrait Photographer in Bangalore | Studios 28", "Studios 28 is a Bangalore photography studio for weddings, portraits, maternity & brand shoots. Editorial style, heirloom-quality galleries. Book now."), component: () => <PageLayout><Home /></PageLayout> });
