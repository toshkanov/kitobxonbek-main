import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizeMap = { sm: "size-3.5", md: "size-4", lg: "size-5" } as const;

export function RatingStars({
  value,
  max = 5,
  size = "sm",
  showValue,
  className,
}: RatingStarsProps) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Reyting ${value.toFixed(1)} / ${max}`}>
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 === rounded;
          return (
            <Star
              key={i}
              className={cn(
                sizeMap[size],
                filled || half
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted-foreground/40",
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-muted-foreground text-xs font-medium">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
