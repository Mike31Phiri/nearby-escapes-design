import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function AccessibilityPage() {
  return (
    <AppPage eyebrow="Accessibility" title="Make Wandr work better for you" description="Set accessibility preferences for stays, communication and interface comfort.">
      <CardGrid cards={[{"title": "Mobility and room access requirements", "description": "Mobility and room access requirements is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Visual comfort and reduced-motion defaults", "description": "Visual comfort and reduced-motion defaults keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Support notes shared only when needed", "description": "Support notes shared only when needed gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Mobility and room access requirements", "Visual comfort and reduced-motion defaults", "Support notes shared only when needed"]} />
      <FormPreview fields={["Primary detail", "Secondary detail"]} textarea="Notes" />
      <AssuranceBand />
    </AppPage>
  );
}
