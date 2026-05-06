import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, leftIcon, rightSlot, type = "text", ...props }, ref) => (
    <div
      className={cn(
        "glass glass-specular flex h-12 items-center gap-2 rounded-full px-4",
        "focus-within:ring-ring/40 focus-within:ring-2",
        className,
      )}
    >
      {leftIcon && <span className="text-muted-foreground shrink-0">{leftIcon}</span>}
      <input
        ref={ref}
        type={type}
        className="placeholder:text-muted-foreground/80 h-full w-full bg-transparent text-sm outline-none"
        {...props}
      />
      {rightSlot}
    </div>
  ),
);
GlassInput.displayName = "GlassInput";
