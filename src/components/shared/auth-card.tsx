import { ReactNode } from "react";
import { GlassCard } from "@/components/glass";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <GlassCard variant="strong" className="rounded-3xl p-7 md:p-8">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>}
      </header>
      {children}
      {footer && (
        <p className="text-muted-foreground mt-6 text-center text-sm">{footer}</p>
      )}
    </GlassCard>
  );
}
