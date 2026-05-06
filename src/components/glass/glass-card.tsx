import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassVariant = "default" | "strong" | "soft";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  specular?: boolean;
  asChild?: boolean;
}

const variantClass: Record<GlassVariant, string> = {
  default: "glass",
  strong: "glass-strong",
  soft: "glass-soft",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", specular = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl",
          variantClass[variant],
          specular && "glass-specular",
          className,
        )}
        {...props}
      />
    );
  },
);
GlassCard.displayName = "GlassCard";
