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
  RotateCcw,
  Download,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/components/layout/AdminPageHeader";
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
import { toast } from "sonner";

// Category Config

const categoryConfig: Record<string, { label: string; icon: React.ElementType }> = {
  commission: { label: "Commission & Payouts", icon: DollarSign },
  booking: { label: "Booking Policies", icon: CalendarDays },
  moderation: { label: "Moderation & Safety", icon: ShieldCheck },
  platform: { label: "Platform Settings", icon: Globe },
  notifications: { label: "Notifications", icon: Bell },
};

// Setting Field

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
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-sm font-semibold text-neutral-900">{setting.label}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{setting.description}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange(setting.key, enabled ? "false" : "true")}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors shrink-0",
            enabled ? "bg-purple" : "bg-neutral-200",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-xs transition-transform",
              enabled && "translate-x-5",
            )}
          />
        </button>
      </div>
    );
  }

  if (setting.type === "select" && setting.options) {
    return (
      <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-sm font-semibold text-neutral-900">{setting.label}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{setting.description}</p>
        </div>
        <Select value={value} onValueChange={(v) => onChange(setting.key, v)}>
          <SelectTrigger className="w-full sm:w-[220px] h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-xs font-medium">
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
    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-semibold text-neutral-900">{setting.label}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{setting.description}</p>
      </div>
      <Input
        type={setting.type === "number" ? "number" : "text"}
        value={value}
        onChange={(e) => onChange(setting.key, e.target.value)}
        className="w-full sm:w-[220px] h-10 rounded-xl border-neutral-200/80 bg-neutral-50/50 text-xs font-medium"
      />
    </div>
  );
}

// Main Component

export function AdminSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>(mockSystemSettings);
  const [activeCategory, setActiveCategory] = useState<string>("all");
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

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nearbyescapes-settings-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Settings backup exported");
  };

  const visibleCategories = activeCategory === "all" ? categories : [activeCategory];

  return (
    <div className="flex-1 min-h-screen bg-neutral-50/50 pb-16">
      <AdminPageHeader
        eyebrow="System & Policies"
        title="System Settings"
        description="Configure platform-wide rules, commissions, moderation limits, and notification triggers"
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-xl text-xs font-semibold border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 shadow-2xs"
              onClick={handleExportJSON}
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-neutral-500" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-xl text-xs font-semibold border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 shadow-2xs"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5 text-neutral-400" />
              Reset
            </Button>
            <Button
              size="sm"
              className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white shadow-2xs"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1.5" /> Save Changes
                </>
              )}
            </Button>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6 mt-6 space-y-6">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5",
              activeCategory === "all"
                ? "bg-neutral-900 text-white font-semibold shadow-xs"
                : "bg-white border border-neutral-200/80 text-neutral-600 hover:bg-neutral-50",
            )}
          >
            <Sliders className="h-3.5 w-3.5" />
            All Settings
          </button>
          {categories.map((cat) => {
            const cfg = categoryConfig[cat] ?? { label: cat, icon: Settings };
            const Icon = cfg.icon;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5",
                  isSelected
                    ? "bg-neutral-900 text-white font-semibold shadow-xs"
                    : "bg-white border border-neutral-200/80 text-neutral-600 hover:bg-neutral-50",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Settings Categories */}
        <div className="space-y-6">
          {visibleCategories.map((category) => {
            const cfg = categoryConfig[category] ?? {
              label: category,
              icon: Settings,
            };
            const Icon = cfg.icon;
            const categorySettings = settings.filter((s) => s.category === category);

            return (
              <div
                key={category}
                className="rounded-2xl border border-neutral-200/80 bg-white shadow-2xs overflow-hidden"
              >
                <div className="flex items-center gap-3.5 px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
                  <div className="h-10 w-10 rounded-xl bg-purple/10 border border-purple/15 text-purple flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">{cfg.label}</h3>
                    <p className="text-xs text-neutral-500">
                      {categorySettings.length} active configuration rule
                      {categorySettings.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="px-6 divide-y divide-neutral-100">
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

        {/* Sticky Save Bar */}
        <div className="sticky bottom-6 rounded-2xl border border-neutral-200/80 bg-white/95 backdrop-blur-md p-4 shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>All platform policy changes are staged locally until saved.</span>
          </div>
          <Button
            size="sm"
            className="h-9 px-4 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white shrink-0"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 mr-1.5" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
