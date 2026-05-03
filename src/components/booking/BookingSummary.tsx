"use client";

import { useBookingStore } from "@/store/bookingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MapPin, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export function BookingSummary() {
  const { packageDetails, stayDetails, guestInfo } = useBookingStore();

  const details = packageDetails || stayDetails;
  const isPackage = !!packageDetails;

  if (!details) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = details as any;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {d.listingImage || d.packageImage ? (
          <img
            src={d.listingImage || d.packageImage}
            alt={d.listingName || d.packageName || ""}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        ) : null}

        <div>
          <h3 className="font-semibold text-lg">{d.listingName || d.packageName}</h3>
          {isPackage && (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                {d.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {d.duration}
              </div>
            </>
          )}
          {!isPackage && d.checkIn && (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Calendar className="h-4 w-4" />
                {format(d.checkIn, "MMM dd, yyyy")} - {format(d.checkOut, "MMM dd, yyyy")}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {d.guests} {d.guests === 1 ? "guest" : "guests"}
              </div>
            </>
          )}
        </div>

        {guestInfo && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Guest Information</h4>
            <p className="text-sm">
              {guestInfo.firstName} {guestInfo.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{guestInfo.email}</p>
            <p className="text-sm text-muted-foreground">{guestInfo.phone}</p>
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${d.subtotal.toFixed(2)}</span>
          </div>
          {d.cleaningFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cleaning fee</span>
              <span>${d.cleaningFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service fee</span>
            <span>${d.serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxes</span>
            <span>${d.taxes.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">${d.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Free Cancellation
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Cancel up to 48 hours before for a full refund
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
