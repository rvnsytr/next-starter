import { cn } from "@/core/utils";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { motion } from "motion/react";
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
    typeof error === "string" ? error : (error?.message ?? "Tidak ada data");
  return (
    <div
      className={cn(
        "bg-destructive/10 text-destructive flex flex-col items-center justify-center gap-2 rounded-md p-4 text-center text-sm",
        className,
      )}
    >
      <div className="flex items-center gap-x-2">
        <TriangleAlertIcon className="size-4 shrink-0" /> {error?.code}
      </div>
      {!hideText && <pre>{message}</pre>}
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
    <div className="flex min-h-dvh flex-col items-center justify-center gap-y-8">
      <ErrorFallback error={error} />
    </div>
  );
}
