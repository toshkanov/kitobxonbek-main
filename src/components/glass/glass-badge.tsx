import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "primary" | "destructive";
}

const toneClass: Record<NonNullable<GlassBadgeProps["tone"]>, string> = {
  default: "glass text-foreground",
  primary: "bg-primary/90 text-primary-foreground",
  destructive: "bg-destructive/90 text-white",
};

export const GlassBadge = forwardRef<HTMLSpanElement, GlassBadgeProps>(
  ({ className, tone = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold leading-none tracking-tight",
        toneClass[tone],
        className,
      )}
      {...props}
    />
  ),
);
GlassBadge.displayName = "GlassBadge";
