"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  Fingerprint,
  Globe,
  Lock,
  Mail,
  ScrollText,
  ShieldCheck,
  Smartphone,
  UploadCloud,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const inputClass =
  "w-full h-11 rounded-xl border px-3.5 text-sm bg-white text-neutral-900 focus:outline-none border-neutral-200 focus:border-purple";

const labelClass = "text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5";

function CardHeader({
  title,
  desc,
  action,
}: {
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5 gap-3">
      <div>
        <h2 className="text-base font-bold text-neutral-900">{title}</h2>
        <p className="text-[11px] text-neutral-500 mt-0.5">{desc}</p>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Security & Authentication                                        */
/* ------------------------------------------------------------------ */

function SecurityCard() {
  const [twoFa, setTwoFa] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  const savePassword = () => {
    if (!pw.current || !pw.next || !pw.confirm) {
      setPwError("Fill in all password fields.");
      return;
    }
    if (pw.next.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (pw.next !== pw.confirm) {
      setPwError("New passwords do not match.");
      return;
    }
    setPwError("");
    setShowPasswordForm(false);
    setPw({ current: "", next: "", confirm: "" });
    toast.success("Password updated successfully");
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
      <CardHeader title="Security & Authentication" desc="Password and 2FA." />

      <div className="space-y-4">
        {/* Password */}
        <div className="rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-purple/10 text-purple flex items-center justify-center shrink-0">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-neutral-900">Password</p>
                <p className="text-[11px] text-neutral-500">Last changed 2 months ago</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowPasswordForm((v) => !v);
                setPwError("");
              }}
              className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-neutral-200 text-[10px] font-black uppercase tracking-wider text-neutral-600 hover:border-purple/40 hover:text-purple transition-all"
            >
              {showPasswordForm ? "Cancel" : "Change"}
            </button>
          </div>

          {showPasswordForm && (
            <div className="mt-4 space-y-3 border-t border-neutral-100 pt-4">
              <div>
                <label className={labelClass}>Current Password</label>
                <input
                  type="password"
                  value={pw.current}
                  onChange={(e) => setPw({ ...pw, current: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>New Password</label>
                  <input
                    type="password"
                    value={pw.next}
                    onChange={(e) => setPw({ ...pw, next: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <input
                    type="password"
                    value={pw.confirm}
                    onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              {pwError && <p className="text-[11px] font-semibold text-rose-600">{pwError}</p>}
              <button
                onClick={savePassword}
                className="h-10 px-5 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-black uppercase tracking-wider transition-all"
              >
                Update Password
              </button>
            </div>
          )}
        </div>

        {/* 2FA */}
        <div className="rounded-xl border border-neutral-200 p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Fingerprint className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-neutral-900">Two-Factor Authentication</p>
              <p className="text-[11px] text-neutral-500">
                {twoFa ? "Authenticator app · Last code 3 min ago" : "Extra login protection is off"}
              </p>
            </div>
          </div>
          <Switch
            checked={twoFa}
            onCheckedChange={(v) => {
              setTwoFa(v);
              toast.success(v ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
            }}
            aria-label="Toggle two-factor authentication"
          />
        </div>

      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Notification & Communication Preferences                         */
/* ------------------------------------------------------------------ */

const NOTIF_CHANNELS = [
  { id: "email", label: "Email", desc: "Sent to chanda.bwalya@nearbyescapes.com", icon: Mail },
  { id: "sms", label: "SMS", desc: "Sent to +260 977 123 456", icon: Smartphone },
  { id: "push", label: "App Push", desc: "Instant alerts in the host app", icon: Bell },
];

const NOTIF_EVENTS = [
  { id: "bookings", label: "New bookings" },
  { id: "cancellations", label: "Cancellations" },
  { id: "messages", label: "Customer messages" },
  { id: "reviews", label: "Pending reviews" },
];

function NotificationsCard() {
  const [channels, setChannels] = useState<Record<string, boolean>>({
    email: true,
    sms: true,
    push: true,
  });
  const [events, setEvents] = useState<Record<string, boolean>>({
    bookings: true,
    cancellations: true,
    messages: true,
    reviews: false,
  });

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
      <CardHeader
        title="Notification Preferences"
        desc="Choose how and when you want to be alerted."
      />

      <p className={labelClass}>Channels</p>
      <div className="space-y-2 mb-5">
        {NOTIF_CHANNELS.map((ch) => {
          const Icon = ch.icon;
          return (
            <div key={ch.id} className="rounded-xl border border-neutral-200 px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-purple/10 text-purple flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-neutral-900">{ch.label}</p>
                  <p className="text-[11px] text-neutral-500">{ch.desc}</p>
                </div>
              </div>
              <Switch
                checked={channels[ch.id]}
                onCheckedChange={(v) => {
                  setChannels((prev) => ({ ...prev, [ch.id]: v }));
                  toast.success(`${ch.label} alerts ${v ? "enabled" : "disabled"}`);
                }}
                aria-label={`Toggle ${ch.label}`}
              />
            </div>
          );
        })}
      </div>

      <p className={labelClass}>Alert Events</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {NOTIF_EVENTS.map((ev) => (
          <div key={ev.id} className="rounded-xl border border-neutral-200 px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-[13px] font-semibold text-neutral-800">{ev.label}</p>
            <Switch
              checked={events[ev.id]}
              onCheckedChange={(v) => setEvents((prev) => ({ ...prev, [ev.id]: v }))}
              aria-label={`Toggle ${ev.label}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Language, Region & Timezone                                      */
/* ------------------------------------------------------------------ */

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "pt", label: "Portuguese" },
  { value: "sw", label: "Swahili" },
];

const REGIONS = [
  { value: "ZM", label: "Zambia" },
  { value: "ZA", label: "South Africa" },
  { value: "KE", label: "Kenya" },
  { value: "TZ", label: "Tanzania" },
  { value: "GB", label: "United Kingdom" },
];

const TIMEZONES = [
  { value: "Africa/Lusaka", label: "Africa/Lusaka (CAT)" },
  { value: "Africa/Johannesburg", label: "Africa/Johannesburg (SAST)" },
  { value: "Africa/Nairobi", label: "Africa/Nairobi (EAT)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
  { value: "UTC", label: "UTC" },
];

function LanguageRegionCard() {
  const [prefs, setPrefs] = useState({
    language: "en",
    region: "ZM",
    timezone: "Africa/Lusaka",
    dateFormat: "DD/MM/YYYY",
  });

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
      <CardHeader
        title="Language, Region & Timezone"
        desc="Display language, timezone and local formatting."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Portal Language</label>
          <select
            value={prefs.language}
            onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
            className={inputClass}
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Region</label>
          <select
            value={prefs.region}
            onChange={(e) => setPrefs({ ...prefs, region: e.target.value })}
            className={inputClass}
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Timezone</label>
          <select
            value={prefs.timezone}
            onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
            className={inputClass}
          >
            {TIMEZONES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Date Format</label>
          <select
            value={prefs.dateFormat}
            onChange={(e) => setPrefs({ ...prefs, dateFormat: e.target.value })}
            className={inputClass}
          >
            <option value="DD/MM/YYYY">Day / Month / Year</option>
            <option value="MM/DD/YYYY">Month / Day / Year</option>
            <option value="YYYY-MM-DD">Year - Month - Day</option>
          </select>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-[#FAF7F2] border border-[#E8E3DC] px-3.5 py-2.5 flex items-center gap-2">
        <Globe className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
        <p className="text-[11px] text-neutral-500">
          Tour times and cut-offs are shown in{" "}
          <strong className="font-bold text-neutral-700">
            {TIMEZONES.find((t) => t.value === prefs.timezone)?.label ?? prefs.timezone}
          </strong>
          .
        </p>
      </div>

      <button
        onClick={() => toast.success("Language & regional preferences saved")}
        className="mt-4 h-10 px-5 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-black uppercase tracking-wider transition-all"
      >
        Save Preferences
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Default Terms & Cancellation Policy                               */
/* ------------------------------------------------------------------ */

const CANCEL_POLICIES = [
  {
    value: "flexible",
    label: "Flexible",
    desc: "Free cancellation up to 24 hours before the start time. Full refund.",
  },
  {
    value: "moderate",
    label: "Moderate",
    desc: "Free cancellation up to 7 days before the start time. 50% refund within 48 hours.",
  },
  {
    value: "strict",
    label: "Strict",
    desc: "Free cancellation up to 14 days before. No refund within 48 hours of start.",
  },
];

const DEFAULT_TERMS =
  "All bookings are subject to availability and confirmation. Guests must arrive 15 minutes before the scheduled start time. Nearby Escapes acts as an intermediary between host and guest; the contract for services is between the guest and the host.";

function TermsPolicyCard() {
  const [policy, setPolicy] = useState("flexible");
  const [terms, setTerms] = useState(DEFAULT_TERMS);

  const selected = CANCEL_POLICIES.find((p) => p.value === policy);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
      <CardHeader
        title="Default Terms & Cancellation Policy"
        desc="Applied to all new hosted activities unless overridden."
      />

      <p className={labelClass}>Cancellation Policy</p>
      <div className="space-y-2 mb-5">
        {CANCEL_POLICIES.map((p) => (
          <button
            key={p.value}
            onClick={() => setPolicy(p.value)}
            className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all ${
              policy === p.value
                ? "border-purple bg-purple/5"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className={`text-[13px] font-bold ${policy === p.value ? "text-purple" : "text-neutral-900"}`}>
                {p.label}
              </p>
              {policy === p.value && (
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-purple bg-purple/10 rounded-full px-2 py-0.5">
                  <CheckCircle2 className="h-3 w-3" /> Default
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">{p.desc}</p>
          </button>
        ))}
      </div>

      <label className={labelClass}>Default Terms of Service</label>
      <textarea
        value={terms}
        onChange={(e) => setTerms(e.target.value)}
        rows={4}
        className="w-full rounded-xl border px-3.5 py-2.5 text-sm bg-white text-neutral-900 focus:outline-none border-neutral-200 focus:border-purple resize-none"
      />

      <div className="mt-4 rounded-xl bg-[#FAF7F2] border border-[#E8E3DC] px-3.5 py-2.5 flex items-center gap-2">
        <ScrollText className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
        <p className="text-[11px] text-neutral-500">
          Default: <strong className="font-bold text-neutral-700">{selected?.label}</strong> ·{" "}
          {selected?.desc}
        </p>
      </div>

      <button
        onClick={() => toast.success("Default terms & cancellation policy saved")}
        className="mt-4 h-10 px-5 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-black uppercase tracking-wider transition-all"
      >
        Save Policy
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Legal, Compliance & Documents                                    */
/* ------------------------------------------------------------------ */

const DOCUMENTS = [
  {
    id: "license",
    name: "Business License",
    desc: "PACRA / municipal trading license",
    expires: "Renews 31 Dec 2026",
    icon: FileText,
  },
  {
    id: "insurance",
    name: "Commercial Liability Insurance",
    desc: "Public liability insurance certificate",
    expires: "Renews 30 Nov 2026",
    icon: ShieldCheck,
  },
  {
    id: "tax",
    name: "Tax Identification (ZRA)",
    desc: "ZRA TIN certificate",
    expires: "On file",
    icon: BadgeCheck,
  },
];

function LegalDocumentsCard() {
  const [docs, setDocs] = useState(DOCUMENTS);

  const upload = (id: string) => {
    const doc = docs.find((d) => d.id === id);
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, expires: "Renews 12 months from upload" } : d)));
    toast.success(`${doc?.name ?? "Document"} uploaded — pending review`);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
      <CardHeader
        title="Legal, Compliance & Documents"
        desc="Licenses, insurance and tax documents for compliance."
      />

      <div className="space-y-2.5">
        {docs.map((doc) => {
          const Icon = doc.icon;
          return (
            <div key={doc.id} className="rounded-xl border border-neutral-200 px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-neutral-900 flex items-center gap-1.5">
                    {doc.name}
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-1.5 py-px">
                      <CheckCircle2 className="h-2.5 w-2.5" /> On file
                    </span>
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {doc.desc} · <span className="text-neutral-400">{doc.expires}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => upload(doc.id)}
                className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-neutral-200 text-[10px] font-black uppercase tracking-wider text-neutral-600 hover:border-purple/40 hover:text-purple transition-all"
              >
                <UploadCloud className="h-3 w-3" /> Renew
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-neutral-400 mt-3.5 flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        Documents expiring within 30 days trigger a renewal reminder — we&apos;ll notify you by email.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Account Settings — all cards                                        */
/* ------------------------------------------------------------------ */

export function AccountSettingsSection() {
  return (
    <div className="space-y-6">
      <SecurityCard />
      <NotificationsCard />
      <LanguageRegionCard />
      <TermsPolicyCard />
      <LegalDocumentsCard />
    </div>
  );
}
