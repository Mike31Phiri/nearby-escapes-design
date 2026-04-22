import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function PrivacyPolicyPage() {
  return (
    <AppPage eyebrow="Privacy policy" title="How Wandr handles data" description="A clear privacy page covering account data, booking activity, cookies and support requests.">
      <CardGrid cards=[{"title": "Data we collect to operate bookings", "description": "Data we collect to operate bookings is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "How consent and analytics preferences work", "description": "How consent and analytics preferences work keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Rights to access, export or delete data", "description": "Rights to access, export or delete data gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Data we collect to operate bookings", "How consent and analytics preferences work", "Rights to access, export or delete data"] />
      <FormPreview fields={["Primary detail", "Secondary detail"]} textarea="Notes" />
      <AssuranceBand />
    </AppPage>
  );
}
