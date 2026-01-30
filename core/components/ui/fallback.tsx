"use client";

import { appMeta } from "@/core/constants/app";
import { cn } from "@/core/utils/helpers";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { motion } from "motion/react";
import { Separator } from "./separator";
import { Spinner } from "./spinner";

export function LoadingFallback({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <LoaderIcon className="text-foreground size-4 animate-spin" />
    </div>
  );
}

export function ErrorFallback({
  error,
  hideText = false,
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  hideText?: boolean;
  className?: string;
}) {
  const message =
    error?.message ?? (typeof error === "string" ? error : "Tidak ada data");
  return (
    <div
      className={cn(
        "border-destructive/40 shadow-destructive text-destructive flex flex-col items-center gap-4 rounded-md border p-4 text-center text-sm",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between gap-x-12">
        <div className="flex items-center gap-x-2 font-medium">
          <TriangleAlertIcon className="size-4 shrink-0" /> {appMeta.name}
        </div>

        <code className="bg-destructive/10 texxs">{error?.code ?? 500}</code>
      </div>

      <Separator className="bg-destructive/40" />

      {!hideText && <pre className="whitespace-pre-line">{message}</pre>}
    </div>
  );
}

export function AppLoadingFallback() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 2 }}
      className="flex min-h-svh flex-col items-center justify-center gap-y-8"
    >
      <Spinner variant="orbit" className="size-8" />
    </motion.div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AppErrorFallback({ error }: { error?: any }) {
  return (
    <div className="container flex min-h-dvh flex-col items-center justify-center gap-y-8">
      <ErrorFallback error={error} />
    </div>
  );
}
