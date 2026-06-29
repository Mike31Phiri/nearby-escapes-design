import { CancellationPolicyPage } from "@/components/guest/legal/CancellationPolicyPage";

export default function CancellationPolicyRoute() {
  return <CancellationPolicyPage />;
}

export async function generateMetadata() {
  return {
    title: "Cancellation & Refund Policy — Nearby Escapes",
    description:
      "Learn about our cancellation and refund policies for accommodations, experiences, and transport bookings. Flexible, moderate, and strict options available.",
  };
}
