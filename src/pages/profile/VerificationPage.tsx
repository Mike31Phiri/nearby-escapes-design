import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function VerificationPage() {
  return (
    <AppPage eyebrow="Verification" title="Build trust faster" description="Prepare identity, email, phone and host verification steps for secure transactions.">
      <StatStrip stats={[{"label": "Email", "value": "Ready"}, {"label": "Phone", "value": "Ready"}, {"label": "ID", "value": "Pending"}]} />
      <CardGrid cards={[{"title": "Email and phone confirmation", "description": "Email and phone confirmation is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Government ID status placeholder", "description": "Government ID status placeholder keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Host business verification", "description": "Host business verification gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Email and phone confirmation", "Government ID status placeholder", "Host business verification"]} />
      <FormPreview fields={["Primary detail", "Secondary detail"]} textarea="Notes" />
      <AssuranceBand />
    </AppPage>
  );
}
