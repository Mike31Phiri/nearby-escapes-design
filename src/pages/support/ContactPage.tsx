import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function ContactPage() {
  return (
    <AppPage eyebrow="Contact support" title="Send Wandr a message" description="Reach the support team with booking, account, payment or hosting questions.">
      <CardGrid cards=[{"title": "Validated contact form", "description": "Validated contact form is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Reason and booking reference fields", "description": "Reason and booking reference fields keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Confirmation state after sending", "description": "Confirmation state after sending gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Validated contact form", "Reason and booking reference fields", "Confirmation state after sending"] />
      <FormPreview fields={["Primary detail", "Secondary detail"]} textarea="Notes" />
      <AssuranceBand />
    </AppPage>
  );
}
