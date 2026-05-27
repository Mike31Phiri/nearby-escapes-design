"use client";

import { TravelPreferencesModal } from "@/components/TravelPreferencesModal";
import { useProfileStore } from "@/store/profileStore";

export function ClientModals() {
  const { showTravelPreferences, dismissTravelPreferences } = useProfileStore();

  return <TravelPreferencesModal open={showTravelPreferences} onClose={dismissTravelPreferences} />;
}
