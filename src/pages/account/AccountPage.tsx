import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function AccountPage() {
  return (
    <AppPage eyebrow="Account" title="Your account hub" description="Manage identity, travel preferences, payments, privacy, taxes and accessibility from one secure place.">
      <StatStrip stats={[{"label": "Profile readiness", "value": "82%"}, {"label": "Saved settings", "value": "7"}, {"label": "Security checks", "value": "3"}]} />
      <CardGrid cards={[{"title": "Personal profile and contact details", "description": "Personal profile and contact details is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Login, password and account protection", "description": "Login, password and account protection keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Payment methods, tax details and notification settings", "description": "Payment methods, tax details and notification settings gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Personal profile and contact details", "Login, password and account protection", "Payment methods, tax details and notification settings"]} />
      <AssuranceBand />
    </AppPage>
  );
}
