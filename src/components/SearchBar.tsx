import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-elegant)]">
      <form className="grid grid-cols-1 items-center gap-1 md:grid-cols-[1.3fr_1fr_1fr_auto]">
        <Field icon={MapPin} label="Where" placeholder="Lusaka, Livingstone…" />
        <Field icon={CalendarDays} label="When" placeholder="Add dates" type="date" />
        <Field icon={Users} label="Who" placeholder="2 guests" />
        <Button
          type="submit"
          size="lg"
          className="h-14 w-full md:w-14 rounded-xl bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-[var(--shadow-glow)]"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
          <span className="md:hidden ml-2">Search</span>
        </Button>
      </form>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  placeholder,
  type = "text",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="group flex cursor-text items-center gap-3 rounded-xl px-4 py-2.5 transition-[var(--transition-smooth)] hover:bg-muted">
      <Icon className="h-5 w-5 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </label>
  );
}
