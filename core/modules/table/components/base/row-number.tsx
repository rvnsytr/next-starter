import { cn } from "cn";

export type RowNumberProps = React.ComponentProps<"div">;

export function RowNumber({ className, ...props }: RowNumberProps) {
  return <div className={cn("tabular-nums", className)} {...props} />;
}
