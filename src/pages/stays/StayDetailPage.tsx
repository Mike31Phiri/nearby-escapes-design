import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function StayDetailPage() {
  return (
    <AppPage eyebrow="Stay detail" title="Everything about the property" description="A rich stay page for photos, amenities, rooms, rules, reviews and booking.">
      <CardGrid cards=[{"title": "Photo gallery and room options", "description": "Photo gallery and room options is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Amenities, rules and location", "description": "Amenities, rules and location keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Booking panel and similar stays", "description": "Booking panel and similar stays gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Photo gallery and room options", "Amenities, rules and location", "Booking panel and similar stays"] />
      <AssuranceBand />
    </AppPage>
  );
}
