import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/core/components/ui/alert";
import { Spinner, SpinnerProps } from "@/core/components/ui/spinner";
import { cn } from "@/core/utils";
import { TriangleAlertIcon } from "lucide-react";
import { appConfig } from "../config";

export type LoadingFallback = SpinnerProps & { containerClassName?: string };

export function LoadingFallback({
  containerClassName,
  ...props
}: LoadingFallback) {
  return (
    <div
      className={cn("flex items-center justify-center p-4", containerClassName)}
    >
      <Spinner {...props} />
    </div>
  );
}

export type ErrorFallbackProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  title?: string;
  hideCode?: boolean;
  hideErrorDetail?: boolean;
  errorOnly?: boolean;
  className?: string;
};

export function ErrorFallback({
  error,
  title,
  hideCode = false,
  hideErrorDetail = false,
  errorOnly = false,
  className,
}: ErrorFallbackProps) {
  let errorData = error;
  let errorMessage =
    error?.message ?? (typeof error === "string" ? error : "Tidak ada data");

  if (error instanceof Error) {
    const { name, message, stack, cause } = error;
    errorData = { ...error, name, message, stack, cause };
    errorMessage = `${name}: ${message}`;
  }

  const errorTitle = title ?? (errorOnly ? errorMessage : appConfig.name);

  return (
    <Alert variant="destructive" className={className}>
      <TriangleAlertIcon />

      {hideCode ? (
        <AlertTitle>{errorTitle}</AlertTitle>
      ) : (
        <AlertTitle>
          {`${errorTitle} / `}
          <code className="bg-destructive/10 text-xs tabular-nums">
            {errorData?.code ?? 500}
          </code>
        </AlertTitle>
      )}

      {!errorOnly && (
        <AlertDescription>
          {errorMessage}
          {!hideErrorDetail && (
            <pre className="text-xs">{JSON.stringify(errorData, null, 2)}</pre>
          )}
        </AlertDescription>
      )}
    </Alert>
  );
}
