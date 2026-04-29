import { ColumnCellNumber, ColumnHeader } from "@/core/components/ui/column";
import { filterFn, formatLocalizedDate } from "@/core/utils";
import { Activity } from "@/shared/db/schema";
import { createColumnHelper } from "@tanstack/react-table";
import { CalendarCheck2Icon, RouteIcon } from "lucide-react";
import { getActivityConfig } from "../config";
import { allActivityType } from "../config.activity-type";

const createColumn = createColumnHelper<Activity>();
export const getActivityColumns = (result?: {
  isLoading: boolean;
  count?: Record<string, number>;
}) => [
  createColumn.display({
    id: "no",
    header: "No",
    cell: (c) => <ColumnCellNumber table={c.table} row={c.row} />,
    enableHiding: false,
  }),
  createColumn.accessor((ac) => ac.type, {
    id: "type",
    header: (c) => (
      <ColumnHeader column={c.column} disabled={result?.isLoading}>
        Tipe
      </ColumnHeader>
    ),
    cell: (c) => c.cell.getValue(),
    filterFn: filterFn("option"),
    meta: {
      label: "Tipe",
      type: "option",
      icon: RouteIcon,
      options: allActivityType.map((value) => {
        const { label, icon } = getActivityConfig(value);
        const count = result?.count?.[value];
        return { value, label, icon, count };
      }),
    },
  }),
  createColumn.accessor((c) => c.createdAt, {
    id: "createdAt",
    header: (c) => <ColumnHeader column={c.column}>Waktu Dibuat</ColumnHeader>,
    cell: (c) => formatLocalizedDate(c.cell.getValue(), "PPPp"),
    filterFn: filterFn("date"),
    meta: {
      label: "Waktu Dibuat",
      type: "date",
      icon: CalendarCheck2Icon,
    },
  }),
];
