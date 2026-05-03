import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function OtpVerifyPage() {
  return (
    <AuthCard title="Verify code" subtitle="Enter the 6-digit code sent to your phone or email.">
      <div className="space-y-5">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <Button
          type="button"
          className="h-11 w-full bg-[image:var(--gradient-hero)] hover:opacity-95"
        >
          Verify
        </Button>
      </div>
    </AuthCard>
  );
}
