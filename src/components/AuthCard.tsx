import Link from "next/link";
import type { ReactNode } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)] flex flex-col">
      <div className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2">
          <img src="/images/logo.png" alt="Nearby Escapes" className="h-9 w-9 rounded-xl object-contain shadow-sm" />
          <span className="font-bold text-lg tracking-tight">Nearby Escapes</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
          <div className="rounded-[40px] border border-border/60 bg-card p-10 shadow-2xl">
            <h1 className="text-3xl font-black tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-base text-muted-foreground font-medium">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
          {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
