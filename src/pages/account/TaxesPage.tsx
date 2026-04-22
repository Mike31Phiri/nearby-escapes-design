import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function TaxesPage() {
  return (
    <AppPage eyebrow="Taxes" title="Tax information" description="Manage invoices, tax residency and host tax documents for compliant payouts.">
      <StatStrip stats=[{"label": "Forms", "value": "0"}, {"label": "Invoices", "value": "0"}, {"label": "Status", "value": "Draft"}] />
      <CardGrid cards=[{"title": "Tax profile for traveler invoices", "description": "Tax profile for traveler invoices is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Host payout tax forms", "description": "Host payout tax forms keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Downloadable yearly statements", "description": "Downloadable yearly statements gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Tax profile for traveler invoices", "Host payout tax forms", "Downloadable yearly statements"] />
      <FormPreview fields={["Primary detail", "Secondary detail"]} textarea="Notes" />
      <AssuranceBand />
    </AppPage>
  );
}
