import { ColumnCellNumber, ColumnHeader } from "@/core/components/ui/column";
import { DataControllerResult } from "@/core/hooks/use-data-controller";
import { filterFn, formatLocalizedDate } from "@/core/utils";
import { ActivityWithEntity } from "@/shared/db/schema";
import { createColumnHelper } from "@tanstack/react-table";
import { CalendarCheck2Icon, RouteIcon } from "lucide-react";
import { getActivityTypeConfig } from "../config";
import { allActivityTypes } from "../schema";

const createColumn = createColumnHelper<ActivityWithEntity>();
export const getActivityColumns = (
  result?: DataControllerResult<ActivityWithEntity>,
) => [
  createColumn.display({
    id: "no",
    header: "No",
    cell: (c) => <ColumnCellNumber table={c.table} row={c.row} />,
    enableHiding: false,
  }),
  createColumn.accessor((ac) => ac.type, {
    id: "type",
    header: (c) => <ColumnHeader column={c.column}>Tipe</ColumnHeader>,
    cell: (c) => c.cell.getValue(),
    filterFn: filterFn("option"),
    meta: {
      label: "Tipe",
      type: "option",
      icon: RouteIcon,
      options: allActivityTypes.map((value) => {
        const { label, icon } = getActivityTypeConfig(value);
        const count = result?.data?.count?.[value] ?? undefined;
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
