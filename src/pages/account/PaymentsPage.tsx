import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function PaymentsPage() {
  return (
    <AppPage eyebrow="Payments" title="Manage cards and payouts" description="Keep payment methods, receipts and host payout preferences ready for checkout.">
      <StatStrip stats={[{"label": "Cards", "value": "0"}, {"label": "Receipts", "value": "0"}, {"label": "Payouts", "value": "Pending"}]} />
      <CardGrid cards={[{"title": "Saved cards and mobile money methods", "description": "Saved cards and mobile money methods is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Billing address and invoice details", "description": "Billing address and invoice details keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Host payout destination status", "description": "Host payout destination status gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Saved cards and mobile money methods", "Billing address and invoice details", "Host payout destination status"]} />
      <FormPreview fields={["Primary detail", "Secondary detail"]} textarea="Notes" />
      <AssuranceBand />
    </AppPage>
  );
}
