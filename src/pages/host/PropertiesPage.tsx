import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function PropertiesPage() {
  return (
    <AppPage eyebrow="Properties" title="Manage your spaces" description="Review listing status, pricing, amenities and content quality for every property.">
      <StatStrip stats=[{"label": "Published", "value": "2"}, {"label": "Drafts", "value": "1"}, {"label": "Needs review", "value": "1"}] />
      <CardGrid cards=[{"title": "Draft and published listings", "description": "Draft and published listings is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Photo and amenity completeness", "description": "Photo and amenity completeness keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Availability and pricing shortcuts", "description": "Availability and pricing shortcuts gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Draft and published listings", "Photo and amenity completeness", "Availability and pricing shortcuts"] />
      <AssuranceBand />
    </AppPage>
  );
}
