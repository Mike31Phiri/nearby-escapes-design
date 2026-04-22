import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function ProfilePage() {
  return (
    <AppPage eyebrow="Public profile" title="Your traveler identity" description="Preview how your profile appears to hosts and travel partners.">
      <StatStrip stats=[{"label": "Trips", "value": "0"}, {"label": "Reviews", "value": "0"}, {"label": "Verified", "value": "Soon"}] />
      <CardGrid cards=[{"title": "Verified identity and profile photo", "description": "Verified identity and profile photo is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Short bio and travel style", "description": "Short bio and travel style keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Reviews and references", "description": "Reviews and references gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Verified identity and profile photo", "Short bio and travel style", "Reviews and references"] />
      <AssuranceBand />
    </AppPage>
  );
}
