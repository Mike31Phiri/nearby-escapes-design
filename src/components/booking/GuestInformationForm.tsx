"use client";

import { useBookingStore } from "@/store/bookingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Mail, Phone, MessageSquare } from "lucide-react";

export function GuestInformationForm() {
  const { guestInfo, setGuestInfo, setCurrentStep, setIsProcessing, isProcessing } =
    useBookingStore();

  const initialGuest = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  };

  const guest = guestInfo || initialGuest;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate validation
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(3);
    }, 500);
  };

  const handleChange = (field: keyof typeof guest, value: string) => {
    setGuestInfo({ ...guest, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Guest Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={guest.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={guest.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={guest.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john.doe@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={guest.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="specialRequests"
                value={guest.specialRequests || ""}
                onChange={(e) => handleChange("specialRequests", e.target.value)}
                placeholder="Any special requirements or requests..."
                className="pl-10 min-h-[100px]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
            Continue to Payment
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
