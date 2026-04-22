import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function BookingPage() {
  return (
    <AppPage eyebrow="Booking" title="Review your stay" description="Confirm dates, guests, house rules and cancellation terms before payment.">
      <StatStrip stats=[{"label": "Nights", "value": "3"}, {"label": "Guests", "value": "2"}, {"label": "Status", "value": "Draft"}] />
      <CardGrid cards=[{"title": "Trip details and guest count", "description": "Trip details and guest count is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Cancellation policy acknowledgement", "description": "Cancellation policy acknowledgement keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Secure handoff to payment", "description": "Secure handoff to payment gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Trip details and guest count", "Cancellation policy acknowledgement", "Secure handoff to payment"] />
      <AssuranceBand />
    </AppPage>
  );
}
