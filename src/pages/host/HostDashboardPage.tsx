import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function HostDashboardPage() {
  return (
    <AppPage eyebrow="Host dashboard" title="Run your hosting business" description="Track listings, reservations, guest messages and payout readiness from one workspace.">
      <StatStrip stats=[{"label": "Active listings", "value": "3"}, {"label": "Occupancy", "value": "74%"}, {"label": "Revenue", "value": "$4.8k"}] />
      <CardGrid cards=[{"title": "Performance summary and next actions", "description": "Performance summary and next actions is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Reservations needing attention", "description": "Reservations needing attention keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Listing health and payout status", "description": "Listing health and payout status gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Performance summary and next actions", "Reservations needing attention", "Listing health and payout status"] />
      <AssuranceBand />
    </AppPage>
  );
}
