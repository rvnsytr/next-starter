import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";

export const PAGE_SIZES = [5, 10, 20, 30, 40, 50, 100];

export const DEFAULT_PAGE_SIZE = PAGE_SIZES[1];

export const SORT_ICONS = {
  asc: ArrowUpIcon,
  desc: ArrowDownIcon,
  default: ChevronsUpDownIcon,
};

export const DEFAULT_FILTER_TYPE = "string";

export const DEFAULT_EDITOR_TYPE = "string";
