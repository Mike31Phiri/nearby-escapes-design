import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function CollectionDetailPage() {
  return (
    <AppPage eyebrow="Collection detail" title="Plan from one saved list" description="View every saved stay in a collection with notes, prices and availability signals.">
      <CardGrid cards=[{"title": "Collection notes and collaborators", "description": "Collection notes and collaborators is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Saved stay cards and sorting", "description": "Saved stay cards and sorting keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Share link controls", "description": "Share link controls gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Collection notes and collaborators", "Saved stay cards and sorting", "Share link controls"] />
      <AssuranceBand />
    </AppPage>
  );
}
