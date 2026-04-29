import type { ReactNode } from "react";
import { CheckCircle2, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type PageCard = { title: string; description: string; meta?: string };
export type PageStat = { label: string; value: string };

export function AppPage({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description: string; children?: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <header className="max-w-3xl">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">{description}</p>
        </header>
        <div className="mt-8 space-y-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export function CardGrid({ cards }: { cards: PageCard[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <article key={card.title} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          {card.meta && <p className="text-xs font-semibold uppercase tracking-widest text-primary">{card.meta}</p>}
          <h2 className="mt-1 text-lg font-semibold tracking-tight">{card.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
        </article>
      ))}
    </section>
  );
}

export function StatStrip({ stats }: { stats: PageStat[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
          <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </section>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <h2 className="text-lg font-semibold tracking-tight">What happens here</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FormPreview({ fields, textarea, cta = "Save changes" }: { fields: string[]; textarea?: string; cta?: string }) {
  return (
    <form className="max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field} className="space-y-1.5">
            <Label htmlFor={field}>{field}</Label>
            <Input id={field} className="h-11" placeholder={field} />
          </div>
        ))}
        {textarea && (
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor={textarea}>{textarea}</Label>
            <Textarea id={textarea} rows={5} placeholder={textarea} />
          </div>
        )}
      </div>
      <Button type="button" className="mt-5">{cta}</Button>
    </form>
  );
}

export function Timeline({ items }: { items: { title: string; description: string }[] }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.title} className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-semibold tracking-tight">{item.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AssuranceBand({ title = "Built for launch", description = "This page is ready to connect to your NestJS backend when the matching endpoint is available." }: { title?: string; description?: string }) {
  return (
    <section className="rounded-2xl border border-border bg-primary-soft/40 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold tracking-tight">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <Sparkles className="hidden h-5 w-5 text-primary sm:block" />
      </div>
    </section>
  );
}
