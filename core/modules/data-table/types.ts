import { Table } from "@/core/components/ui/table";
import { LucideIcon } from "lucide-react";

export type BaseTableProps = React.ComponentProps<typeof Table> & {
  /** The caption for the table. */
  caption?: string;

  /** The placeholder message to display when the table has no data. */
  placeholder?: string;
};

export type TableMeta = {
  label?: string;
  icon?: LucideIcon;
};
