import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function HostFeedbackPage() {
  return (
    <AppPage eyebrow="Guest feedback" title="Improve every stay" description="Review ratings, guest comments and operational insights for hosted properties.">
      <StatStrip stats=[{"label": "Rating", "value": "4.8"}, {"label": "Reviews", "value": "126"}, {"label": "Open replies", "value": "3"}]} />
      <CardGrid cards={[{"title": "Rating summary by listing", "description": "Rating summary by listing is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Private feedback themes", "description": "Private feedback themes keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Response and resolution queue", "description": "Response and resolution queue gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Rating summary by listing", "Private feedback themes", "Response and resolution queue"]} />
      <AssuranceBand />
    </AppPage>
  );
}
