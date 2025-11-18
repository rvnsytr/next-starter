"use client";

import { cn } from "@/core/utils";
import {
  FrameIcon,
  Loader2Icon,
  LoaderIcon,
  LucideProps,
  RefreshCcw,
} from "lucide-react";
import { useLinkStatus } from "next/link";

export type SpinnerProps = LucideProps & {
  variant?: "default" | "loader" | "refresh" | "frame";
};

export type LoadingSpinnerProps = SpinnerProps & {
  loading?: boolean;
  icon?: { base?: React.ReactNode; spinner?: React.ReactNode };
};

export function Spinner({
  variant = "default",
  className,
  ...props
}: SpinnerProps) {
  const Icon = {
    default: Loader2Icon,
    loader: LoaderIcon,
    refresh: RefreshCcw,
    frame: FrameIcon,
  }[variant];

  return (
    <Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export function LoadingSpinner({
  loading = false,
  icon,
  ...props
}: LoadingSpinnerProps) {
  return loading
    ? (icon?.spinner ?? <Spinner {...props} />)
    : (icon?.base ?? null);
}

export function LinkSpinner({
  ...props
}: Omit<LoadingSpinnerProps, "loading">) {
  const { pending } = useLinkStatus();
  return <LoadingSpinner loading={pending} {...props} />;
}
