import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function CalendarPage() {
  return (
    <AppPage eyebrow="Calendar" title="Control availability" description="Block dates, review reservations and adjust nightly rates across listings.">
      <CardGrid cards=[{"title": "Monthly occupancy view", "description": "Monthly occupancy view is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Blocked dates and minimum stays", "description": "Blocked dates and minimum stays keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Seasonal price notes", "description": "Seasonal price notes gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Monthly occupancy view", "Blocked dates and minimum stays", "Seasonal price notes"] />
      <AssuranceBand />
    </AppPage>
  );
}
