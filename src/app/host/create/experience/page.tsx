"use client";

import { ExperienceCreateFlow } from "@/components/host/create/experience/ExperienceCreateFlow";
import { HostVerificationGuard } from "@/components/host/create/HostVerificationGuard";

export default function HostCreateExperienceRoute() {
  return (
    <HostVerificationGuard>
      <ExperienceCreateFlow />
    </HostVerificationGuard>
  );
}
