import { cn } from "@/core/utils/helpers";

export function Ping({
  className,
  classNames,
}: {
  className?: string;
  classNames?: { container?: string; ping?: string; dot?: string };
}) {
  return (
    <div className={cn("absolute -top-0.75 -left-0.75", className)}>
      <span
        className={cn(
          "relative flex size-3 items-center justify-center",
          classNames?.container,
        )}
      >
        <span
          className={cn(
            "bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            classNames?.ping,
          )}
        />

        <span
          className={cn(
            "bg-primary relative inline-flex size-2 rounded-full",
            classNames?.dot,
          )}
        />
      </span>
    </div>
  );
}
