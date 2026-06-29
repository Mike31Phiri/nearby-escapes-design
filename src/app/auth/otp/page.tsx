import { Suspense } from "react";
import { AuthPageView } from "@/components/guest/auth/AuthPageView";

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <AuthPageView defaultTab="otp" />
    </Suspense>
  );
}
