import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function HostInboxPage() {
  return (
    <AppPage eyebrow="Host inbox" title="Reply faster" description="Manage guest questions, reservation messages and support follow-ups in one thread list.">
      <CardGrid cards={[{"title": "Reservation-linked conversations", "description": "Reservation-linked conversations is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Quick replies and attachments", "description": "Quick replies and attachments keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Priority messages first", "description": "Priority messages first gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Reservation-linked conversations", "Quick replies and attachments", "Priority messages first"]} />
      <AssuranceBand />
    </AppPage>
  );
}
