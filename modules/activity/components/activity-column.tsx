import { ColumnCellNumber, ColumnHeader } from "@/core/components/ui/column";
import { DataControllerResult } from "@/core/hooks/use-data-controller";
import { filterFn, formatLocalizedDate } from "@/core/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { CalendarCheck2Icon, RouteIcon } from "lucide-react";
import { ActivityWithEntity, activities } from "../constants";

const columnHelper = createColumnHelper<ActivityWithEntity>();
export const getActivityColumns = (
  result?: DataControllerResult<ActivityWithEntity>,
) => [
  columnHelper.display({
    id: "no",
    header: "No",
    cell: (c) => <ColumnCellNumber table={c.table} row={c.row} />,
    enableHiding: false,
  }),
  columnHelper.accessor((ac) => ac.eventType, {
    id: "eventType",
    header: (c) => <ColumnHeader column={c.column}>Tipe</ColumnHeader>,
    cell: (c) => c.cell.getValue(),
    filterFn: filterFn("option"),
    meta: {
      label: "Tipe",
      type: "option",
      icon: RouteIcon,
      options: activities.values.map((value) => {
        const { label, icon } = activities.get(value);
        const count = result?.data?.count?.[value] ?? undefined;
        return { value, label, icon, count };
      }),
    },
  }),
  columnHelper.accessor((c) => c.createdAt, {
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
