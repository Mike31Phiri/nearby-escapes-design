"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";

export function CancellationPolicy() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Cancellation Policy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Flexible Cancellation
          </h4>
          <p className="text-sm text-muted-foreground">
            Free cancellation up to 48 hours before check-in. After that, cancellations are subject
            to fees.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">More than 48 hours before</p>
              <p className="text-xs text-muted-foreground">Full refund minus service fee</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">24-48 hours before</p>
              <p className="text-xs text-muted-foreground">50% refund of accommodation cost</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Less than 24 hours or no-show</p>
              <p className="text-xs text-muted-foreground">No refund</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold mb-2 text-sm">Important Notes</h4>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Service fees are non-refundable</li>
            <li>Refunds are processed within 5-7 business days</li>
            <li>Cancellations must be made through your booking confirmation email</li>
            <li>Special events and holidays may have different policies</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
