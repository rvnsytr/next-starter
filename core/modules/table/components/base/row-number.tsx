import { cn } from "@/core/utils";

export type RowNumberProps = React.ComponentProps<"div">;

export function RowNumber({ className, ...props }: RowNumberProps) {
  return <div className={cn("tabular-nums", className)} {...props} />;
}
