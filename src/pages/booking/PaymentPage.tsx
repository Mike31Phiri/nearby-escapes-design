import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function PaymentPage() {
  return (
    <AppPage eyebrow="Payment" title="Complete secure checkout" description="Add payment details, review fees and confirm your booking with confidence.">
      <CardGrid cards=[{"title": "Card or mobile money selection", "description": "Card or mobile money selection is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Transparent price breakdown", "description": "Transparent price breakdown keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Confirmation sent after payment", "description": "Confirmation sent after payment gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Card or mobile money selection", "Transparent price breakdown", "Confirmation sent after payment"] />
      <FormPreview fields={["Primary detail", "Secondary detail"]} textarea="Notes" />
      <AssuranceBand />
    </AppPage>
  );
}
