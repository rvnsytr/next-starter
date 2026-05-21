import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/core/components/ui/alert";
import { Spinner, SpinnerProps } from "@/core/components/ui/spinner";
import { cn } from "@/core/utils";
import { appConfig } from "@/shared/config";
import { TriangleAlertIcon } from "lucide-react";

export function LoadingFallback({
  containerClassName,
  ...props
}: SpinnerProps & { containerClassName?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center p-4", containerClassName)}
    >
      <Spinner {...props} />
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
        {appConfig.name}
        {/* {`${appConfig.name} / `}
        <code className="bg-destructive/10 text-xs tabular-nums">
          {error?.code ?? 500}
        </code> */}
      </AlertTitle>

      {!hideDesc && (
        <AlertDescription>
          <pre className="whitespace-pre-wrap">{message}</pre>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </AlertDescription>
      )}
    </Alert>
  );
}
