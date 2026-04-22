import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function CommunityStandardsPage() {
  return (
    <AppPage eyebrow="Community standards" title="Travel with respect" description="Shared expectations for guests, hosts and support interactions across the marketplace.">
      <CardGrid cards={[{"title": "Respectful communication", "description": "Respectful communication is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Accurate listings and honest reviews", "description": "Accurate listings and honest reviews keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Safety, fraud and reporting rules", "description": "Safety, fraud and reporting rules gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Respectful communication", "Accurate listings and honest reviews", "Safety, fraud and reporting rules"]} />
      <AssuranceBand />
    </AppPage>
  );
}
