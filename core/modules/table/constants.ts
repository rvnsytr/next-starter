import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";

export const PAGE_SIZES = [5, 10, 20, 30, 40, 50, 100];

export const DEFAULT_PAGE_SIZE = PAGE_SIZES[1];

export const SORT_ICONS = {
  asc: ArrowUpIcon,
  desc: ArrowDownIcon,
  default: ChevronsUpDownIcon,
};

export const DEFAULT_FILTER_TYPE = "string";

export const DEFAULT_CELL_EDITOR_TYPE = "string";

export const TABLE_CELL_CLASS = {
  skeleton: "h-7 w-full",
  empty: "text-muted-foreground py-4 text-center whitespace-pre-line",

  base: "relative z-10",

  pin: "bg-background/90 sticky z-20",
  pinFooter: "sticky z-20 backdrop-blur-xs",

  pinLeft: "left-0 pl-4",
  pinRight: "right-0 pr-4",
};
