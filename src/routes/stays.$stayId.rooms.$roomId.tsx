import { createFileRoute } from "@tanstack/react-router";
import { RoomDetailPage } from "@/pages/stays/RoomDetailPage";

export const Route = createFileRoute("/stays/$stayId/rooms/$roomId")({
  head: () => ({
    meta: [
      { title: "Room detail — Wandr" },
      { name: "description", content: "Compare room amenities and nightly pricing." },
      { property: "og:title", content: "Room detail — Wandr" },
      { property: "og:description", content: "Compare room amenities and nightly pricing." },
    ],
  }),
  component: RoomDetailPage,
});
