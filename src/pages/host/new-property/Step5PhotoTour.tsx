import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function Step5PhotoTour() {
  return (
    <AppPage eyebrow="List your property" title="Photo tour" description="Upload room-by-room photos that help guests trust the listing.">
      <Checklist items={["Save draft progress", "Validate required listing details", "Connect this step to the host listing API"]} />
      <FormPreview fields={["Listing detail", "Additional detail"]} textarea="Host notes" cta="Save and continue" />
      <AssuranceBand title="Step ready" description="This listing step has a dedicated page and can be wired to your backend wizard state." />
    </AppPage>
  );
}
