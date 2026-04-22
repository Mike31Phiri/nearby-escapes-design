import { createFileRoute } from "@tanstack/react-router";
import { OtpVerifyPage } from "@/pages/auth/OtpVerifyPage";

export const Route = createFileRoute("/auth/otp")({
  head: () => ({
    meta: [
      { title: "Verify code — Wandr" },
      { name: "description", content: "Verify your sign-in code." },
      { property: "og:title", content: "Verify code — Wandr" },
      { property: "og:description", content: "Verify your sign-in code." },
    ],
  }),
  component: OtpVerifyPage,
});
