"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 overflow-hidden",
    "rounded-full font-medium tracking-tight transition-all",
    "glass-specular",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.97]",
  ],
  {
    variants: {
      variant: {
        default: "glass hover:brightness-110",
        strong: "glass-strong hover:brightness-110",
        soft: "glass-soft hover:glass",
        primary:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:brightness-110",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-9 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(glassButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
GlassButton.displayName = "GlassButton";
