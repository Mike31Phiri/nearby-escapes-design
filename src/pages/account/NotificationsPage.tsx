import { AppPage, AssuranceBand, CardGrid, Checklist, FormPreview, StatStrip } from "@/pages/PageScaffold";

export function NotificationsPage() {
  return (
    <AppPage eyebrow="Notifications" title="Choose what reaches you" description="Fine tune booking reminders, host messages, offers and security alerts.">
      <CardGrid cards=[{"title": "Email reminders before check-in", "description": "Email reminders before check-in is structured as a dedicated section so it can connect cleanly to your NestJS API.", "meta": "Core"}, {"title": "SMS alerts for booking changes", "description": "SMS alerts for booking changes keeps the workflow clear on mobile and desktop.", "meta": "UX"}, {"title": "Marketing and discovery recommendations", "description": "Marketing and discovery recommendations gives this page a practical production-ready purpose.", "meta": "Ready"}] />
      <Checklist items=["Email reminders before check-in", "SMS alerts for booking changes", "Marketing and discovery recommendations"] />
      <FormPreview fields={["Primary detail", "Secondary detail"]} textarea="Notes" />
      <AssuranceBand />
    </AppPage>
  );
}
