import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function CollectionsPage() {
  return (
    <AppPage eyebrow="Collections" title="Saved places" description="Organize stays into collections for weekend escapes, safari plans and city breaks.">
      <StatStrip stats={[{"label": "Saved", "value": "8"}, {"label": "Shared", "value": "2"}, {"label": "Ideas", "value": "4"}]} />
      <CardGrid cards={[{"title": "Private and shared collections", "description": "Private and shared collections is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Quick compare for saved stays", "description": "Quick compare for saved stays keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Invite friends to plan together", "description": "Invite friends to plan together gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Private and shared collections", "Quick compare for saved stays", "Invite friends to plan together"]} />
      <AssuranceBand />
    </AppPage>
  );
}
