import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function PreferencesPage() {
  return (
    <AppPage eyebrow="Preferences" title="Personalize Wandr" description="Set language, currency, accessibility, and travel preferences for a smoother trip flow.">
      <CardGrid cards=[{"title": "Default currency and measurement units", "description": "Default currency and measurement units is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Preferred accommodation types", "description": "Preferred accommodation types keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Accessibility and reduced-motion preferences", "description": "Accessibility and reduced-motion preferences gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Default currency and measurement units", "Preferred accommodation types", "Accessibility and reduced-motion preferences"] />
      <FormPreview fields={["Primary detail", "Secondary detail"]} textarea="Notes" />
      <AssuranceBand />
    </AppPage>
  );
}
