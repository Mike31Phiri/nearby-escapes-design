import { createFileRoute } from "@tanstack/react-router";
import { CalendarPage } from "@/pages/host/CalendarPage";

export const Route = createFileRoute("/host_/calendar")({
  head: () => ({
    meta: [
      { title: "Host calendar — Wandr" },
      { name: "description", content: "Control property availability and pricing." },
      { property: "og:title", content: "Host calendar — Wandr" },
      { property: "og:description", content: "Control property availability and pricing." },
    ],
  }),
  component: CalendarPage,
});
