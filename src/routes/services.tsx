import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "../lib/seo";
import PageLayout from "../studio/layouts/PageLayout";
import Services from "../studio/pages/Services";
export const Route = createFileRoute("/services")({ head: () => pageHead("/services", "Photography Services & Pricing in Bangalore | Studios 28", "Wedding, portrait, maternity, event & brand photography services in Bangalore. Custom packages — call for tailored pricing and availability."), component: () => <PageLayout><Services /></PageLayout> });
