import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function SecurityPage() {
  return (
    <AppPage eyebrow="Login & security" title="Protect every booking" description="Review password, sign-in methods, active sessions and account recovery options.">
      <StatStrip stats=[{"label": "Password", "value": "Strong"}, {"label": "2FA", "value": "Ready"}, {"label": "Sessions", "value": "1"}] />
      <CardGrid cards=[{"title": "Password update flow", "description": "Password update flow is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "Two-factor authentication placeholder", "description": "Two-factor authentication placeholder keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Trusted devices and recent sign-in activity", "description": "Trusted devices and recent sign-in activity gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Password update flow", "Two-factor authentication placeholder", "Trusted devices and recent sign-in activity"] />
      <AssuranceBand />
    </AppPage>
  );
}
