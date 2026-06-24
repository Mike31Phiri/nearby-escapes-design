import { cn } from "@/lib/utils";

interface ExclusiveBadgeProps {
  className?: string;
}

export function ExclusiveBadge({ className }: ExclusiveBadgeProps) {
  return (
    <div
      className={cn(
        "absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 shadow-sm",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
      <span className="text-[10px] font-semibold text-primary tracking-tight">Exclusive</span>
    </div>
  );
}
