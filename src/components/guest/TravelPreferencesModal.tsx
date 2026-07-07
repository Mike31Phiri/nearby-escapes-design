"use client";

interface TravelPreferencesModalProps {
  open: boolean;
  onClose: () => void;
}

export function TravelPreferencesModal({ open, onClose }: TravelPreferencesModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg p-6 shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Travel Preferences</h2>
        <p className="text-muted-foreground mb-4">
          Tell us about your travel preferences so we can personalize your experience.
        </p>
        <button
          onClick={onClose}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-base font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
