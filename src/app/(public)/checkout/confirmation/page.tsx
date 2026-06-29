import { Suspense } from "react";
import { BookingConfirmationPage } from "@/components/guest/checkout/BookingConfirmationPage";

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <BookingConfirmationPage />
    </Suspense>
  );
}
