import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function SpotlightHomePage() {
  return (
    <AppPage eyebrow="Spotlight" title="Featured stays and local stories" description="Highlight editor-picked properties, seasonal travel ideas and destination guides.">
      <CardGrid cards=[{"title": "Featured property stories", "description": "Featured property stories is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Seasonal destination picks", "description": "Seasonal destination picks keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Editorial cards for sharing", "description": "Editorial cards for sharing gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Featured property stories", "Seasonal destination picks", "Editorial cards for sharing"] />
      <AssuranceBand />
    </AppPage>
  );
}
