"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold sm:text-4xl">Nimadir noto&apos;g&apos;ri ketdi</h1>
      <p className="text-muted-foreground max-w-md">
        Iltimos, sahifani yangilang yoki birozdan keyin qayta urinib ko&apos;ring.
      </p>
      <Button onClick={() => reset()} size="lg">
        Qayta urinish
      </Button>
    </main>
  );
}
