import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function TermsPage() {
  return (
    <AppPage eyebrow="Terms of service" title="Clear rules for using Wandr" description="Understand booking responsibilities, account rules, host obligations and platform limits.">
      <CardGrid cards=[{"title": "Traveler and host responsibilities", "description": "Traveler and host responsibilities is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Booking, cancellation and refund terms", "description": "Booking, cancellation and refund terms keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Acceptable use and dispute process", "description": "Acceptable use and dispute process gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Traveler and host responsibilities", "Booking, cancellation and refund terms", "Acceptable use and dispute process"] />
      <AssuranceBand />
    </AppPage>
  );
}
