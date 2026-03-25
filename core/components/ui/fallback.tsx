import { appMeta } from "@/config/app";
import { cn } from "@/core/utils/helpers";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { Separator } from "./separator";

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
        "bg-destructive/10 shadow-destructive text-destructive flex size-full flex-col items-center gap-4 rounded-md p-4 text-sm",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between gap-x-12">
        <div className="flex items-center gap-x-2 font-medium">
          <TriangleAlertIcon className="size-4 shrink-0" /> {appMeta.name}
        </div>

        <code className="bg-destructive/10 text-xs tabular-nums">
          {error?.code ?? 500}
        </code>
      </div>

      <Separator className="bg-destructive/20" />

      {!hideText && (
        <div className="flex size-full items-center justify-center">
          <pre>{message}</pre>
        </div>
      )}
    </div>
  );
}
