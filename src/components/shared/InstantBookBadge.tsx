import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstantBookBadgeProps {
  className?: string;
}

export function InstantBookBadge({ className }: InstantBookBadgeProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-1 text-xs font-semibold text-primary", className)}
    >
      <Zap className="h-3.5 w-3.5 fill-primary text-primary" />
      <span>Instant Book</span>
    </div>
  );
}
