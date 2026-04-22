import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function PerformancePage() {
  return (
    <AppPage eyebrow="Performance" title="Measure listing health" description="See search visibility, conversion, response times and guest satisfaction trends.">
      <StatStrip stats=[{"label": "Views", "value": "12.4k"}, {"label": "Conversion", "value": "6.2%"}, {"label": "Response", "value": "18m"}] />
      <CardGrid cards=[{"title": "Views and conversion rates", "description": "Views and conversion rates is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Response speed and acceptance rate", "description": "Response speed and acceptance rate keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Suggestions for listing quality", "description": "Suggestions for listing quality gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Views and conversion rates", "Response speed and acceptance rate", "Suggestions for listing quality"] />
      <AssuranceBand />
    </AppPage>
  );
}
