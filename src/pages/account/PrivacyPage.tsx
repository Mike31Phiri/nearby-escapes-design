import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function PrivacyPage() {
  return (
    <AppPage eyebrow="Privacy" title="Control your data and visibility" description="Choose how profile information, personalization and analytics preferences are handled.">
      <CardGrid cards=[{"title": "Public profile visibility", "description": "Public profile visibility is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Data export and delete request actions", "description": "Data export and delete request actions keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Personalization and consent controls", "description": "Personalization and consent controls gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Public profile visibility", "Data export and delete request actions", "Personalization and consent controls"] />
      <FormPreview fields={["Primary detail", "Secondary detail"]} textarea="Notes" />
      <AssuranceBand />
    </AppPage>
  );
}
