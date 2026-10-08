import { cn } from "cn";

export function Ping({
  className,
  classNames,
}: {
  className?: string;
  classNames?: { container?: string; ping?: string; dot?: string };
}) {
  return (
    <div className={cn("absolute -top-0.5 -right-0.5", className)}>
      <span
        className={cn(
          "relative flex size-3 items-center justify-center",
          classNames?.container,
        )}
      >
        <span
          className={cn(
            "bg-primary opacity absolute inline-flex h-full w-full animate-ping rounded-full",
            classNames?.ping,
          )}
        />

        <span
          className={cn(
            "bg-primary relative inline-flex size-2.5 rounded-full",
            classNames?.dot,
          )}
        />
      </span>
    </div>
  );
}
