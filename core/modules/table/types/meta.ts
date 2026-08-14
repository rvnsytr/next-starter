import { LucideIcon } from "lucide-react";

export type ColumnMeta = {
  /** The label displayed in the column header */
  label?: string;

  /** The icon displayed alongside the column header label */
  icon?: LucideIcon;

  /** The maximum value allowed for number-based filters */
  max?: number;

  /** Props applied to the column's header cell (`<th>`) */
  headerProps?: Omit<React.ComponentProps<"th">, "rowSpan" | "colSpan">;

  /** Props applied to the column's data cell (`<td>`) */
  cellProps?: Omit<React.ComponentProps<"td">, "rowSpan" | "colSpan">;

  /** Props applied to the column's footer cell (`<th>`) */
  // footerProps?: React.ComponentProps<"th">;
};
