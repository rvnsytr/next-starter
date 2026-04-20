import { cn } from "@/core/utils";
import { Badge } from "./badge";

export function CustomColorBadge({
  color,
  darkColor,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Badge>, "variant"> & {
  color: string;
  darkColor?: string;
}) {
  return (
    <Badge
      style={
        {
          "--badge-color": color,
          "--badge-dark-color": darkColor ?? color,
        } as React.CSSProperties
      }
      className={cn(
        "bg-(--badge-color)/10 text-(--badge-color) outline-none dark:bg-(--badge-dark-color)/20 dark:text-(--badge-dark-color)",
        "focus-visible:border-(--badge-color)/40 focus-visible:ring-(--badge-color)/20 dark:focus-visible:ring-(--badge-dark-color)/40",
        "[a]:hover:bg-(--badge-color)/20 dark:[a]:hover:bg-(--badge-color)/30",
        className,
      )}
      {...props}
    />
  );
}
