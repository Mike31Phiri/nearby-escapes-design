"use client";

import { useState } from "react";
import {
  Settings,
  DollarSign,
  CalendarDays,
  ShieldCheck,
  Globe,
  Bell,
  Save,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockSystemSettings } from "@/lib/mock-admin-data";
import type { SystemSetting } from "@/lib/mock-admin-data";
import { useLoading, withLoading } from "@/lib/loading-context";
import { toastSettingsSaved, toastSettingsReset } from "@/lib/admin-toast";

// ─── Category Config ────────────────────────────────────────────────────

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  commission: { label: "Commission & Payouts", icon: DollarSign, color: "#10b981" },
  booking: { label: "Booking Policies", icon: CalendarDays, color: "#3b82f6" },
  moderation: { label: "Moderation & Safety", icon: ShieldCheck, color: "#8b5cf6" },
  platform: { label: "Platform Settings", icon: Globe, color: "#f59e0b" },
  notifications: { label: "Notifications", icon: Bell, color: "#ec4899" },
};

// ─── Setting Field ──────────────────────────────────────────────────────

function SettingField({
  setting,
  value,
  onChange,
}: {
  setting: SystemSetting;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  if (setting.type === "boolean") {
    const enabled = value === "true";
    return (
      <div className="flex items-center justify-between py-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{setting.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange(setting.key, enabled ? "false" : "true")}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors shrink-0 ml-4",
            enabled ? "bg-primary" : "bg-muted-foreground/30",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
              enabled && "translate-x-5",
            )}
          />
        </button>
      </div>
    );
  }

  if (setting.type === "select" && setting.options) {
    return (
      <div className="py-3">
        <p className="text-sm font-semibold text-foreground mb-1">{setting.label}</p>
        <p className="text-xs text-muted-foreground mb-2">{setting.description}</p>
        <Select value={value} onValueChange={(v) => onChange(setting.key, v)}>
          <SelectTrigger className="w-full max-w-xs h-10 rounded-xl border-border/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {setting.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="py-3">
      <p className="text-sm font-semibold text-foreground mb-1">{setting.label}</p>
      <p className="text-xs text-muted-foreground mb-2">{setting.description}</p>
      <Input
        type={setting.type === "number" ? "number" : "text"}
        value={value}
        onChange={(e) => onChange(setting.key, e.target.value)}
        className="max-w-xs h-10 rounded-xl border-border/60"
      />
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────

export function AdminSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>(mockSystemSettings);
  const { setLoading, setLoadingMessage } = useLoading();
  const [saving, setSaving] = useState(false);

  const categories = Array.from(new Set(settings.map((s) => s.category)));

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const handleSave = () => {
    withLoading(
      setLoading,
      setLoadingMessage,
      async () => {
        await new Promise((r) => setTimeout(r, 1200));
        toastSettingsSaved();
        setSaving(false);
      },
      "Saving platform settings...",
    );
  };

  const handleReset = () => {
    setSettings(mockSystemSettings);
    toastSettingsReset();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="flex-1">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-8">
          <div className="mx-auto max-w-5xl px-4 md:px-6 pt-6 md:pt-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  System Settings
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure platform-wide settings and policies
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg text-xs font-semibold border-border/60"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  className="h-9 rounded-lg text-xs font-semibold"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5 mr-1" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings by Category */}
        <div className="mx-auto max-w-5xl px-4 md:px-6 pb-16">
          <div className="space-y-8">
            {categories.map((category) => {
              const cfg = categoryConfig[category] ?? {
                label: category,
                icon: Settings,
                color: "#6b7280",
              };
              const Icon = cfg.icon;
              const categorySettings = settings.filter((s) => s.category === category);

              return (
                <div
                  key={category}
                  className="rounded-xl border border-border/50 bg-card shadow-sm"
                >
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-border/30">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${cfg.color}1a`, color: cfg.color }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{cfg.label}</h3>
                      <p className="text-xs text-muted-foreground">
                        {categorySettings.length} settings
                      </p>
                    </div>
                  </div>
                  <div className="px-6 py-2 divide-y divide-border/20">
                    {categorySettings.map((setting) => (
                      <SettingField
                        key={setting.id}
                        setting={setting}
                        value={setting.value}
                        onChange={handleChange}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save Bar (sticky on mobile) */}
          <div className="mt-8 flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              All settings are saved locally. Click &quot;Save Changes&quot; to apply.
            </div>
            <Button
              className="rounded-lg text-xs font-semibold"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
