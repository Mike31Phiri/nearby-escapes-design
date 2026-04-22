import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function RoomDetailPage() {
  return (
    <AppPage eyebrow="Room detail" title="Choose the right room" description="Compare sleeping arrangements, amenities, cancellation terms and nightly pricing.">
      <CardGrid cards={[{"title": "Room photos and bed setup", "description": "Room photos and bed setup is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Included amenities and rules", "description": "Included amenities and rules keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Availability and price details", "description": "Availability and price details gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Room photos and bed setup", "Included amenities and rules", "Availability and price details"]} />
      <AssuranceBand />
    </AppPage>
  );
}
