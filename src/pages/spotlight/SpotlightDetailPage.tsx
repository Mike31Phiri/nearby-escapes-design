import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function SpotlightDetailPage() {
  return (
    <AppPage eyebrow="Spotlight story" title="A deeper look at a featured stay" description="Long-form content for a featured place, host story or destination guide.">
      <CardGrid cards=[{"title": "Hero story and gallery", "description": "Hero story and gallery is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Linked stays and booking path", "description": "Linked stays and booking path keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Share-ready editorial metadata", "description": "Share-ready editorial metadata gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Hero story and gallery", "Linked stays and booking path", "Share-ready editorial metadata"] />
      <AssuranceBand />
    </AppPage>
  );
}
