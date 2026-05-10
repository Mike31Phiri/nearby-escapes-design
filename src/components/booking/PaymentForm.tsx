"use client";

import { useBookingStore } from "@/store/bookingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle } from "lucide-react";
import { useState } from "react";

export function PaymentForm() {
  const {
    paymentInfo,
    setPaymentInfo,
    setIsProcessing,
    isProcessing,
    setBookingConfirmed,
    packageDetails,
    stayDetails,
    transportDetails,
  } = useBookingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialPayment = {
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    billingAddress: "",
    billingCity: "",
    billingPostalCode: "",
    billingCountry: "",
  };

  const payment = paymentInfo || initialPayment;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!payment.cardNumber || payment.cardNumber.replace(/\s/g, "").length !== 16)
      newErrors.cardNumber = "Valid 16-digit card number required";
    if (!payment.cardHolder) newErrors.cardHolder = "Card holder name required";
    if (!payment.expiryMonth) newErrors.expiryMonth = "Expiry month required";
    if (!payment.expiryYear) newErrors.expiryYear = "Expiry year required";
    if (!payment.cvv || payment.cvv.length < 3) newErrors.cvv = "Valid CVV required";
    if (!payment.billingAddress) newErrors.billingAddress = "Billing address required";
    if (!payment.billingCity) newErrors.billingCity = "City required";
    if (!payment.billingPostalCode) newErrors.billingPostalCode = "Postal code required";
    if (!payment.billingCountry) newErrors.billingCountry = "Country required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const confirmationId = `CONF-${Date.now().toString(36).toUpperCase()}`;
    setBookingConfirmed(true, confirmationId);
    setIsProcessing(false);
  };

  const handleChange = (field: keyof typeof payment, value: string) => {
    let formattedValue = value;
    if (field === "cardNumber")
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    if (field === "cvv") formattedValue = value.replace(/\D/g, "").slice(0, 4);
    setPaymentInfo({ ...payment, [field]: formattedValue });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const bookingDetails = packageDetails || stayDetails || transportDetails;
  const totalAmount = bookingDetails?.total || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">ZMW {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Card Information</h3>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={payment.cardNumber}
                onChange={(e) => handleChange("cardNumber", e.target.value)}
                placeholder="1234 5678 9012 3456"
                className={errors.cardNumber ? "border-red-500" : ""}
              />
              {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Card Holder Name</Label>
              <Input
                id="cardHolder"
                value={payment.cardHolder}
                onChange={(e) => handleChange("cardHolder", e.target.value)}
                placeholder="John Doe"
                className={errors.cardHolder ? "border-red-500" : ""}
              />
              {errors.cardHolder && <p className="text-sm text-red-500">{errors.cardHolder}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Expiry Month</Label>
                <select
                  id="expiryMonth"
                  value={payment.expiryMonth}
                  onChange={(e) => handleChange("expiryMonth", e.target.value)}
                  className={`flex h-10 w-full rounded-md border ${errors.expiryMonth ? "border-red-500" : "border-input"} bg-background px-3 py-2 text-sm`}
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                      {(i + 1).toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                {errors.expiryMonth && <p className="text-sm text-red-500">{errors.expiryMonth}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryYear">Expiry Year</Label>
                <select
                  id="expiryYear"
                  value={payment.expiryYear}
                  onChange={(e) => handleChange("expiryYear", e.target.value)}
                  className={`flex h-10 w-full rounded-md border ${errors.expiryYear ? "border-red-500" : "border-input"} bg-background px-3 py-2 text-sm`}
                >
                  <option value="">YYYY</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    );
                  })}
                </select>
                {errors.expiryYear && <p className="text-sm text-red-500">{errors.expiryYear}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                value={payment.cvv}
                onChange={(e) => handleChange("cvv", e.target.value)}
                placeholder="123"
                maxLength={4}
                className={errors.cvv ? "border-red-500" : ""}
              />
              {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <h3 className="font-semibold">Billing Address</h3>
            <div className="space-y-2">
              <Label htmlFor="billingAddress">Street Address</Label>
              <Input
                id="billingAddress"
                value={payment.billingAddress}
                onChange={(e) => handleChange("billingAddress", e.target.value)}
                placeholder="123 Main Street"
                className={errors.billingAddress ? "border-red-500" : ""}
              />
              {errors.billingAddress && (
                <p className="text-sm text-red-500">{errors.billingAddress}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingCity">City</Label>
                <Input
                  id="billingCity"
                  value={payment.billingCity}
                  onChange={(e) => handleChange("billingCity", e.target.value)}
                  placeholder="Lusaka"
                  className={errors.billingCity ? "border-red-500" : ""}
                />
                {errors.billingCity && <p className="text-sm text-red-500">{errors.billingCity}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingPostalCode">Postal Code</Label>
                <Input
                  id="billingPostalCode"
                  value={payment.billingPostalCode}
                  onChange={(e) => handleChange("billingPostalCode", e.target.value)}
                  placeholder="10001"
                  className={errors.billingPostalCode ? "border-red-500" : ""}
                />
                {errors.billingPostalCode && (
                  <p className="text-sm text-red-500">{errors.billingPostalCode}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingCountry">Country</Label>
              <Input
                id="billingCountry"
                value={payment.billingCountry}
                onChange={(e) => handleChange("billingCountry", e.target.value)}
                placeholder="Zambia"
                className={errors.billingCountry ? "border-red-500" : ""}
              />
              {errors.billingCountry && (
                <p className="text-sm text-red-500">{errors.billingCountry}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" size="lg" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <CreditCard className="mr-2 h-4 w-4 animate-pulse" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Booking - ZMW {totalAmount.toFixed(2)}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
