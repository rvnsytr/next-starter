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
  empty: "text-muted-foreground py-4 text-center whitespace-pre-line",

  resizeHandler:
    "absolute top-0 right-0 h-full w-2 cursor-col-resize touch-none select-none",
  resizeIndicator:
    "border-primary pointer-events-none absolute top-0 right-0 h-full w-px border-r border-dashed",

  base: "relative z-10",

  pin: "bg-background/90 sticky z-20",
  pinFooter: "sticky z-20 backdrop-blur-xs",

  pinLeft: "left-0 pl-4",
  pinRight: "right-0 pr-4",

  cellEditPadding: "px-0 py-1",
};
