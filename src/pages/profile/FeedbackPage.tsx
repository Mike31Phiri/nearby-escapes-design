import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function FeedbackPage() {
  return (
    <AppPage eyebrow="Profile feedback" title="Reviews about you" description="See reviews from hosts and guests connected to your completed trips.">
      <StatStrip stats=[{"label": "Average", "value": "New"}, {"label": "Reviews", "value": "0"}, {"label": "Pending", "value": "0"}]} />
      <CardGrid cards={[{"title": "Ratings received after completed stays", "description": "Ratings received after completed stays is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Private improvement notes", "description": "Private improvement notes keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Review response controls", "description": "Review response controls gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Ratings received after completed stays", "Private improvement notes", "Review response controls"]} />
      <AssuranceBand />
    </AppPage>
  );
}
