import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function CollectionPage() {
  return (
    <AppPage eyebrow="Stay collection" title="Browse a curated set of stays" description="A route for themed property collections like riverside lodges or city stays.">
      <CardGrid cards=[{"title": "Collection overview and filters", "description": "Collection overview and filters is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Property cards with availability hints", "description": "Property cards with availability hints keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "SEO-ready themed landing content", "description": "SEO-ready themed landing content gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Collection overview and filters", "Property cards with availability hints", "SEO-ready themed landing content"] />
      <AssuranceBand />
    </AppPage>
  );
}
