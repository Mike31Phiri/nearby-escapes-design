import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function SupportPage() {
  return (
    <AppPage eyebrow="Support center" title="Find help quickly" description="Browse help topics for accounts, bookings, hosting, payments and safety.">
      <CardGrid cards=[{"title": "Topic cards for common questions", "description": "Topic cards for common questions is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Contact and escalation options", "description": "Contact and escalation options keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Operational status messaging", "description": "Operational status messaging gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Topic cards for common questions", "Contact and escalation options", "Operational status messaging"] />
      <AssuranceBand />
    </AppPage>
  );
}
