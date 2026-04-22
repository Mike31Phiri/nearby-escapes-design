import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function InboxPage() {
  return (
    <AppPage eyebrow="Inbox" title="Messages" description="Centralize traveler, host and support conversations with booking context.">
      <StatStrip stats=[{"label": "Unread", "value": "3"}, {"label": "Trips", "value": "2"}, {"label": "Support", "value": "1"}]} />
      <CardGrid cards={[{"title": "Trip-aware message threads", "description": "Trip-aware message threads is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Quick replies for common questions", "description": "Quick replies for common questions keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Unread and archived filters", "description": "Unread and archived filters gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Trip-aware message threads", "Quick replies for common questions", "Unread and archived filters"]} />
      <AssuranceBand />
    </AppPage>
  );
}
