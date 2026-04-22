import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function EditProfilePage() {
  return (
    <AppPage eyebrow="Edit profile" title="Update your public profile" description="Change profile photo, bio, languages and the details visible to hosts.">
      <CardGrid cards={[{"title": "Display name and profile image", "description": "Display name and profile image is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Bio, languages and location", "description": "Bio, languages and location keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Visibility preview before saving", "description": "Visibility preview before saving gives this page a practical production-ready purpose.", "meta": "Ready"}]} />
      <Checklist items={["Display name and profile image", "Bio, languages and location", "Visibility preview before saving"]} />
      <FormPreview fields={["Primary detail", "Secondary detail"]} textarea="Notes" />
      <AssuranceBand />
    </AppPage>
  );
}
