import { CellData } from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";

export type TableMeta = {
  /** Whether the table is in a loading state. */
  loading?: boolean;
};

export type ColumnMeta = {
  /** The label displayed in the column header */
  label?: string;

  /** The icon displayed alongside the column header label */
  icon?: LucideIcon;

  /** The minimum value allowed for number-based filters */
  min?: number;

  /** The maximum value allowed for number-based filters */
  max?: number;

  /** Props applied to the column's header cell (`<th>`) */
  headerProps?: React.ComponentProps<"th">;

  /** Props applied to the column's data cell (`<td>`) */
  cellProps?:
    | Omit<React.ComponentProps<"td">, "rowSpan" | "colSpan">
    | ((
        cellValue: CellData,
      ) => Omit<React.ComponentProps<"td">, "rowSpan" | "colSpan">);

  /** Props applied to the column's footer cell (`<td>`) */
  footerProps?: React.ComponentProps<"td"> & { isPlaceholder?: boolean };
};
