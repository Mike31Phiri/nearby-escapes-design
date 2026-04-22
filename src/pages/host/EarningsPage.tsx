import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function EarningsPage() {
  return (
    <AppPage eyebrow="Earnings" title="Track payouts" description="Understand monthly revenue, upcoming payouts, service fees and tax documents.">
      <StatStrip stats=[{"label": "This month", "value": "$1.2k"}, {"label": "Pending", "value": "$420"}, {"label": "Paid", "value": "$8.7k"}] />
      <CardGrid cards=[{"title": "Net earnings and pending balances", "description": "Net earnings and pending balances is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Payout method status", "description": "Payout method status keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Downloadable reports", "description": "Downloadable reports gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Net earnings and pending balances", "Payout method status", "Downloadable reports"] />
      <AssuranceBand />
    </AppPage>
  );
}
