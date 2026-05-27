import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  ShieldCheck,
  Ban,
  Clock,
} from "lucide-react";
import type React from "react";

// ─── Icon Toast Helpers ─────────────────────────────────────────────────

function ToastContent({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3 w-full">
      <div
        className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}1a`, color }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

// ─── Toast Variants ─────────────────────────────────────────────────────

export function showSuccess(title: string, description?: string) {
  toast.custom(
    (t) => (
      <div className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-lg dark:border-emerald-800 dark:bg-emerald-950/80">
        <ToastContent icon={CheckCircle2} title={title} description={description} color="#10b981" />
      </div>
    ),
    { duration: 3500 },
  );
}

export function showError(title: string, description?: string) {
  toast.custom(
    (t) => (
      <div className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-lg dark:border-rose-800 dark:bg-rose-950/80">
        <ToastContent icon={XCircle} title={title} description={description} color="#e11d48" />
      </div>
    ),
    { duration: 5000 },
  );
}

export function showWarning(title: string, description?: string) {
  toast.custom(
    (t) => (
      <div className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-lg dark:border-amber-800 dark:bg-amber-950/80">
        <ToastContent
          icon={AlertTriangle}
          title={title}
          description={description}
          color="#f59e0b"
        />
      </div>
    ),
    { duration: 4000 },
  );
}

export function showInfo(title: string, description?: string) {
  toast.custom(
    (t) => (
      <div className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-lg dark:border-blue-800 dark:bg-blue-950/80">
        <ToastContent icon={Info} title={title} description={description} color="#3b82f6" />
      </div>
    ),
    { duration: 3500 },
  );
}

// ─── Loading Toast ──────────────────────────────────────────────────────
// Returns a dismiss function. Call it with the success/error result.

export function showLoadingToast(
  title: string,
  description?: string,
): (successTitle?: string, errorTitle?: string) => void {
  const toastId = toast.custom(
    (t) => (
      <div className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-border/50 bg-card p-4 shadow-lg">
        <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
    ),
    { duration: Infinity },
  );

  return (successTitle?: string, errorTitle?: string) => {
    toast.dismiss(toastId);
    if (successTitle) {
      showSuccess(successTitle);
    } else if (errorTitle) {
      showError(errorTitle);
    }
  };
}

// ─── Admin-Specific Action Toasts ───────────────────────────────────────

export function toastUserVerified(userName: string) {
  showSuccess(`${userName} verified`, "User account has been marked as verified.");
}

export function toastUserSuspended(userName: string) {
  showWarning(`${userName} suspended`, "This user can no longer access the platform.");
}

export function toastUserReactivated(userName: string) {
  showSuccess(`${userName} reactivated`, "User has been restored to active status.");
}

export function toastListingApproved(listingName: string) {
  showSuccess(
    `"${listingName}" approved`,
    "The listing has been published and is now visible to guests.",
  );
}

export function toastListingRejected(listingName: string) {
  showWarning(`"${listingName}" rejected`, "The host will be notified of this decision.");
}

export function toastBookingAccepted(guestName: string) {
  showSuccess(
    `Booking from ${guestName} confirmed`,
    "The guest has been notified and the booking is now active.",
  );
}

export function toastBookingDeclined(guestName: string) {
  showInfo(`Booking from ${guestName} declined`, "The guest has been notified of this decision.");
}

export function toastSettingsSaved() {
  showSuccess("Settings saved", "Platform-wide settings have been updated successfully.");
}

export function toastSettingsReset() {
  showInfo("Settings reset", "All settings have been restored to their default values.");
}

export function toastReportExported() {
  showSuccess("Report exported", "Your report has been downloaded as a CSV file.");
}
