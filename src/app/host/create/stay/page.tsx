"use client";

import { StayCreateFlow } from "@/components/host/create/stay/StayCreateFlow";
import { HostVerificationGuard } from "@/components/host/create/HostVerificationGuard";

export default function HostCreateStayRoute() {
  return (
    <HostVerificationGuard>
      <StayCreateFlow />
    </HostVerificationGuard>
  );
}
