import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function SharedCollectionPage() {
  return (
    <AppPage eyebrow="Shared collection" title="Plan together" description="A public-friendly view for collections shared with friends, family or travel partners.">
      <CardGrid cards={[{"title": "Read-only shared itinerary", "description": "Read-only shared itinerary is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Collaborator context", "description": "Collaborator context keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Fast path back to booking", "description": "Fast path back to booking gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Read-only shared itinerary", "Collaborator context", "Fast path back to booking"]} />
      <AssuranceBand />
    </AppPage>
  );
}
