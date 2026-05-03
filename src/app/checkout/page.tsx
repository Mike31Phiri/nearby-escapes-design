"use client";

import { useBookingStore } from "@/store/bookingStore";
import { GuestInformationForm } from "@/components/booking/GuestInformationForm";
import { PaymentForm } from "@/components/booking/PaymentForm";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { CancellationPolicy } from "@/components/booking/CancellationPolicy";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, CreditCard, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { currentStep, bookingConfirmed, confirmationId, resetBooking } = useBookingStore();

  useEffect(() => {
    // Redirect if no booking details
    const hasDetails = false; // Will be checked by components
    if (!hasDetails && currentStep === 1) {
      // Could redirect to home or packages page
    }
  }, [currentStep, router]);

  if (bookingConfirmed && confirmationId) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Your booking has been completed successfully.
            </p>

            <div className="bg-muted rounded-lg p-6 mb-6 text-left">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Confirmation ID:</span>
                <span className="font-mono font-bold text-lg">{confirmationId}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to your email address with all the details.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-3">What's Next?</h3>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>You'll receive a confirmation email shortly</li>
                <li>A host/travel specialist will contact you within 24 hours</li>
                <li>Receive detailed information and check-in instructions</li>
                <li>Get access to our mobile app for on-the-go support</li>
              </ol>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => {
                  resetBooking();
                  router.push("/packages");
                }}
                className="px-6 py-3 border border-border rounded-md hover:bg-muted transition-colors"
              >
                Browse More
              </button>
              <button
                onClick={() => {
                  resetBooking();
                  router.push("/bookings");
                }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                View My Bookings
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground text-lg">
            Just a few more steps to secure your reservation
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex items-center gap-2 ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                1
              </div>
              <span className="hidden sm:inline">Review</span>
            </div>
            <div className={`w-12 h-0.5 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div
              className={`flex items-center gap-2 ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <User className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline">Guest Info</span>
            </div>
            <div className={`w-12 h-0.5 ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`} />
            <div
              className={`flex items-center gap-2 ${currentStep >= 3 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="hidden sm:inline">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground mb-4">
                    Please review your booking details before proceeding
                  </p>
                  <BookingSummary />
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => useBookingStore.getState().setCurrentStep(2)}
                      className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Continue to Guest Information
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && <GuestInformationForm />}

            {currentStep === 3 && <PaymentForm />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BookingSummary />
            <CancellationPolicy />
          </div>
        </div>
      </div>
    </div>
  );
}
