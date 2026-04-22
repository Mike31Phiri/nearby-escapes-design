import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function ConfirmationPage() {
  return (
    <AppPage eyebrow="Booking confirmed" title="Your trip is almost ready" description="A confirmation page for itinerary details, host contact and next steps after checkout.">
      <StatStrip stats=[{"label": "Reference", "value": "WNDR-2048"}, {"label": "Status", "value": "Confirmed"}, {"label": "Support", "value": "24/7"}] />
      <CardGrid cards=[{"title": "Reservation reference and receipt", "description": "Reservation reference and receipt is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Host message and check-in notes", "description": "Host message and check-in notes keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Shareable itinerary summary", "description": "Shareable itinerary summary gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Reservation reference and receipt", "Host message and check-in notes", "Shareable itinerary summary"] />
      <AssuranceBand />
    </AppPage>
  );
}
