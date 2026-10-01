import { User } from "@/core/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Button } from "@/core/components/ui/button";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { sharedSchemas } from "@/shared/schema";
import { format } from "date-fns";
import {
  CalendarCheck2Icon,
  CalendarSyncIcon,
  CircleDotIcon,
  InfoIcon,
  MailIcon,
  ShieldUserIcon,
  UserRoundIcon,
} from "lucide-react";
import { ROLE_META } from "../constants/role-meta";
import { USER_STATUS_META } from "../constants/user-status-meta";
import { getUserStatus } from "../utils";
import { UserRoleBadge } from "./user-role-badge";
import { UserStatusBadge } from "./user-status-badge";

const columnHelper = dataGrid.createAppColumnHelper<User>();

export const getUserColumns = ({
  onDetailClick,
}: {
  onDetailClick: React.Dispatch<React.SetStateAction<User | null>>;
}) =>
  columnHelper.columns([
    columnHelper.display({
      id: "select",
      header: (c) => <c.header.SelectAllCheckbox />,
      cell: (c) => <c.cell.SelectRowCheckbox />,
      size: 50,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
      enableCellSelection: false,
    }),

    columnHelper.display({
      id: "no",
      header: () => <div className="text-center">No</div>,
      cell: (c) => <c.cell.RowNumber className="text-center" />,
      size: 50,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
      enableCellSelection: false,
    }),

    columnHelper.display({
      id: "action",
      header: () => <div className="text-center">Action</div>,
      cell: (c) => (
        <div className="flex justify-center">
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => onDetailClick(c.row.original)}
          >
            <InfoIcon />
          </Button>
        </div>
      ),
      size: 50,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
      enableCellSelection: false,
    }),

    columnHelper.accessor("name", {
      header: (c) => <c.header.ColumnHeader label="Name" />,
      cell: (c) => (
        <div className="flex items-center gap-2">
          <Avatar
            radius="md"
            className="overflow-hidden *:transition-transform *:group-hover/row:scale-105"
          >
            <AvatarImage src={c.row.original.image ?? undefined} />
            <AvatarFallback>{c.getValue().slice(0, 2)}</AvatarFallback>
          </Avatar>
          <p>{c.getValue()}</p>
        </div>
      ),

      filterFn: "string",

      minSize: 300,
      size: 300,

      meta: {
        label: "Name",
        icon: UserRoundIcon,

        editor: {
          type: "string",
          schema: sharedSchemas.string({ min: 1 }),
        },
      },
    }),

    columnHelper.accessor("email", {
      header: (c) => <c.header.ColumnHeader label="Email Address" />,
      cell: (c) => c.getValue(),

      filterFn: "string",

      minSize: 300,
      size: 300,

      meta: {
        label: "Email Address",
        icon: MailIcon,

        editor: {
          type: "string",
          schema: sharedSchemas.email,

          scope: "insert-only",

          inputProps: { type: "email" },
        },
      },
    }),

    columnHelper.accessor((ac) => getUserStatus(ac), {
      id: "status",
      header: (c) => <c.header.ColumnHeader label="Status" align="center" />,
      cell: (c) => (
        <div className="flex justify-center">
          <UserStatusBadge value={c.cell.getValue()} />
        </div>
      ),

      filterFn: "option",

      minSize: 150,
      size: 150,

      meta: {
        label: "Status",
        icon: CircleDotIcon,

        options: Object.entries(USER_STATUS_META).map(([k, v]) => ({
          value: k,
          label: v.label,
          icon: v.icon,
        })),
      },
    }),

    columnHelper.accessor((ac) => ROLE_META[ac.role].label, {
      id: "role",
      header: (c) => <c.header.ColumnHeader label="Role" align="center" />,
      cell: (c) => (
        <div className="flex justify-center">
          <UserRoleBadge value={c.row.original.role} />
        </div>
      ),

      filterFn: "option",

      minSize: 150,
      size: 150,

      meta: {
        label: "Role",
        icon: ShieldUserIcon,

        options: Object.entries(ROLE_META).map(([k, v]) => ({
          value: k,
          label: v.label,
          icon: v.icon,
        })),

        editor: {
          type: "string:option",
          props: { defaultOpen: true },
        },
      },
    }),

    columnHelper.accessor("updatedAt", {
      header: (c) => <c.header.ColumnHeader label="Last Updated" />,
      cell: (c) => format(c.cell.getValue(), "PPPp"),

      filterFn: "temporal",

      minSize: 300,
      size: 300,

      meta: {
        label: "Last Updated",
        icon: CalendarSyncIcon,
      },
    }),

    columnHelper.accessor("createdAt", {
      header: (c) => <c.header.ColumnHeader label="Created At" />,
      cell: (c) => format(c.cell.getValue(), "PPPp"),

      filterFn: "temporal",

      minSize: 300,
      size: 300,

      meta: {
        label: "Created At",
        icon: CalendarCheck2Icon,
      },
    }),
  ]);
