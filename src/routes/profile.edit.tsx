import { createFileRoute } from "@tanstack/react-router";
import { EditProfilePage } from "@/pages/profile/EditProfilePage";

export const Route = createFileRoute("/profile/edit")({
  head: () => ({
    meta: [
      { title: "Edit profile — Wandr" },
      { name: "description", content: "Update your public profile." },
      { property: "og:title", content: "Edit profile — Wandr" },
      { property: "og:description", content: "Update your public profile." },
    ],
  }),
  component: EditProfilePage,
});
