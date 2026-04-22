import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function PersonalInfoPage() {
  return (
    <AppPage eyebrow="Personal information" title="Keep your traveler profile accurate" description="Update the details hosts and support teams use to identify and contact you.">
      <CardGrid cards=[{"title": "Full legal name and preferred display name", "description": "Full legal name and preferred display name is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Phone number and emergency contact", "description": "Phone number and emergency contact keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Home city and short traveler bio", "description": "Home city and short traveler bio gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Full legal name and preferred display name", "Phone number and emergency contact", "Home city and short traveler bio"] />
      <FormPreview fields={["Primary detail", "Secondary detail"]} textarea="Notes" />
      <AssuranceBand />
    </AppPage>
  );
}
