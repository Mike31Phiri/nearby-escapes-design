import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function ArticlePage() {
  return (
    <AppPage eyebrow="Help article" title="Step-by-step guidance" description="A reusable article page for support documentation and policy explanations.">
      <CardGrid cards=[{"title": "Article header and content sections", "description": "Article header and content sections is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Related articles and contact CTA", "description": "Related articles and contact CTA keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "SEO metadata per support topic", "description": "SEO metadata per support topic gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Article header and content sections", "Related articles and contact CTA", "SEO metadata per support topic"] />
      <AssuranceBand />
    </AppPage>
  );
}
