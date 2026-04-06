import { cn } from "@/core/utils/helpers";
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
      variant="default"
      style={
        {
          "--badge-color": color,
          "--badge-dark-color": darkColor ?? color,
        } as React.CSSProperties
      }
      className={cn(
        "bg-(--badge-color)/10 text-(--badge-color) focus-visible:ring-(--badge-color)/20 dark:bg-(--badge-dark-color)/20 dark:text-(--badge-dark-color) dark:focus-visible:ring-(--badge-dark-color)/40 [a]:hover:bg-(--badge-color)/20 dark:[a]:hover:bg-(--badge-dark-color)/20",
        className,
      )}
      {...props}
    />
  );
}
