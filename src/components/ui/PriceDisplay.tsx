import { ngweeToKwacha } from "@/lib/formatting/currency";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  ngwee: number;
  className?: string;
  suffix?: string;
}

export function PriceDisplay({ ngwee, className, suffix }: PriceDisplayProps) {
  return (
    <div className={cn("inline-flex items-baseline gap-1", className)}>
      <span className="font-bold">{ngweeToKwacha(ngwee)}</span>
      {suffix && <span className="text-sm font-normal text-muted-foreground">{suffix}</span>}
    </div>
  );
}
