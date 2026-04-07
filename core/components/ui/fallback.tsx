import { appConfig } from "@/config/app";
import { cn } from "@/core/utils/helpers";
import { LoaderIcon, TriangleAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

export function LoadingFallback({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <LoaderIcon className="text-foreground size-4 animate-spin" />
    </div>
  );
}

export function ErrorFallback({
  error,
  hideDesc = false,
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  hideDesc?: boolean;
  className?: string;
}) {
  const message =
    error?.message ?? (typeof error === "string" ? error : "Tidak ada data");

  return (
    <Alert variant="destructive" className={className}>
      <TriangleAlertIcon />
      <AlertTitle>
        {`${appConfig.name} / `}
        <code className="bg-destructive/10 text-xs tabular-nums">
          {error?.code ?? 500}
        </code>
      </AlertTitle>

      {!hideDesc && (
        <AlertDescription>
          <pre>{message}</pre>
        </AlertDescription>
      )}
    </Alert>
  );
}
