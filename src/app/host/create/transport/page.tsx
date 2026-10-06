"use client";

import { TransportCreateFlow } from "@/components/host/create/transport/TransportCreateFlow";
import { HostVerificationGuard } from "@/components/host/create/HostVerificationGuard";

export default function HostCreateTransportRoute() {
  return (
    <HostVerificationGuard>
      <TransportCreateFlow />
    </HostVerificationGuard>
  );
}
