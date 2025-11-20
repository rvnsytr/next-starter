"use client";

import { cn } from "@/core/utils";
import {
  Frame,
  Loader2Icon,
  LoaderIcon,
  LucideIcon,
  LucideProps,
  Orbit,
  RefreshCcw,
} from "lucide-react";
import { useLinkStatus } from "next/link";

type SpinnerVariant = "default" | "loader" | "refresh" | "frame" | "orbit";
export type SpinnerProps = LucideProps & { variant?: SpinnerVariant };

export type LoadingSpinnerProps = SpinnerProps & {
  loading?: boolean;
  icon?: { base?: React.ReactNode; spinner?: React.ReactNode };
};

export function Spinner({
  variant = "default",
  className,
  ...props
}: SpinnerProps) {
  const allIcon: Record<SpinnerVariant, LucideIcon> = {
    default: Loader2Icon,
    loader: LoaderIcon,
    refresh: RefreshCcw,
    frame: Frame,
    orbit: Orbit,
  };

  const reverseArr: SpinnerVariant[] = ["orbit"];
  const Icon = allIcon[variant];

  return (
    <Icon
      role="status"
      aria-label="Loading"
      className={cn(
        "size-4 animate-spin",
        reverseArr.includes(variant) && "animate-reverse",
        className,
      )}
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
