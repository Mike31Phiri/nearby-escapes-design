import { Suspense } from "react";
import { BookingConfirmationPage } from "@/components/checkout/BookingConfirmationPage";

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <BookingConfirmationPage />
    </Suspense>
  );
}
