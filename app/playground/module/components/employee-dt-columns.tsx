import { CustomColorBadge } from "@/core/components/ui/badge";
import { dataTable } from "@/core/modules/table/hooks/data-table";
import { formatNumber } from "@/core/utils";
import { UserStatusBadge } from "@/modules/auth/components/user-status-badge";
import { formatDate } from "date-fns";
import {
  BookOpenTextIcon,
  BookUserIcon,
  Building2Icon,
  CalendarCheck2Icon,
  CircleDotIcon,
  DollarSignIcon,
  FoldersIcon,
  HandshakeIcon,
  MailIcon,
  ShieldUserIcon,
  UserRoundIcon,
} from "lucide-react";
import { skillMeta, userRoleMeta } from "../constants";
import { Employee } from "../data";

const columnHelper = dataTable.createAppColumnHelper<Employee>();

export const employeeDTColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    header: (c) => <c.header.SelectAllCheckbox />,
    cell: (c) => <c.cell.RowCheckbox />,
    size: 50,
    enableHiding: false,
    enableResizing: false,
    enableSorting: false,
  }),
  columnHelper.display({
    id: "no",
    header: () => <div className="text-center">No</div>,
    cell: (c) => <c.cell.RowNumber className="text-center" />,
    size: 50,
    enableHiding: false,
    enableResizing: false,
    enableSorting: false,
  }),
  columnHelper.accessor("name", {
    header: (c) => <c.header.ColumnHeader label="Name" />,
    cell: (c) => c.getValue(),

    filterFn: "string",

    minSize: 250,
    size: 250,

    meta: {
      label: "Name",
      icon: UserRoundIcon,
    },
  }),
  columnHelper.accessor("email", {
    header: (c) => <c.header.ColumnHeader label="Email Address" />,
    cell: (c) => c.getValue(),

    filterFn: "string",

    minSize: 250,
    size: 250,

    meta: {
      label: "Email Address",
      icon: MailIcon,
    },
  }),
  columnHelper.accessor("age", {
    header: (c) => <c.header.ColumnHeader label="Age" align="center" />,
    cell: (c) => (
      <div className="text-muted-foreground text-center">
        <span className="text-foreground">{formatNumber(c.getValue())}</span>{" "}
        yrs
      </div>
    ),

    minSize: 100,
    size: 100,

    meta: {
      label: "Age",
      icon: UserRoundIcon,
    },
  }),
  columnHelper.accessor("salary", {
    header: (c) => <c.header.ColumnHeader label="Salary" />,
    cell: (c) => `$${formatNumber(c.getValue())}/yr`,

    minSize: 150,
    size: 150,

    meta: {
      label: "Salary Amount",
      icon: DollarSignIcon,
    },
  }),
  columnHelper.accessor("createdAt", {
    header: (c) => <c.header.ColumnHeader label="Join Date" />,
    cell: (c) => formatDate(c.getValue(), "PPPp"),

    minSize: 200,
    size: 200,

    meta: {
      label: "Join Date",
      icon: CalendarCheck2Icon,
    },
  }),
  columnHelper.accessor("status", {
    header: (c) => <c.header.ColumnHeader label="User Status" />,
    cell: (c) => <UserStatusBadge value={c.getValue()} />,

    minSize: 150,
    size: 150,

    meta: {
      label: "User Status",
      icon: CircleDotIcon,
    },
  }),
  columnHelper.accessor("role", {
    header: (c) => <c.header.ColumnHeader label="Role" />,
    cell: (c) => {
      const role = c.getValue();
      const { color } = userRoleMeta[role];
      return <CustomColorBadge color={color}>{role}</CustomColorBadge>;
    },

    minSize: 150,
    size: 150,

    meta: {
      label: "Role",
      icon: ShieldUserIcon,
    },
  }),
  columnHelper.accessor("skills", {
    header: (c) => <c.header.ColumnHeader label="Skills" />,
    cell: (c) => (
      <div className="flex flex-wrap gap-1">
        {c.getValue().map((item) => (
          <CustomColorBadge key={item} color={skillMeta[item].color}>
            {item}
          </CustomColorBadge>
        ))}
      </div>
    ),

    minSize: 500,
    size: 500,

    meta: {
      label: "Skills",
      icon: BookOpenTextIcon,
    },
  }),
  columnHelper.accessor("department", {
    header: (c) => <c.header.ColumnHeader label="Department" />,
    cell: (c) => c.getValue(),

    filterFn: "string",

    minSize: 150,
    size: 150,

    meta: {
      label: "Department",
      icon: Building2Icon,
    },
  }),
  columnHelper.accessor("manager", {
    header: (c) => <c.header.ColumnHeader label="Manager Name" />,
    cell: (c) => c.getValue() ?? "-",

    filterFn: "string",

    minSize: 250,
    size: 250,

    meta: {
      label: "Manager Name",
      icon: HandshakeIcon,
    },
  }),
  columnHelper.accessor("phone", {
    header: (c) => <c.header.ColumnHeader label="Phone" />,
    cell: (c) => c.getValue() ?? "-",

    filterFn: "string",

    minSize: 150,
    size: 150,

    meta: {
      label: "Phone Number",
      icon: BookUserIcon,
    },
  }),
  columnHelper.group({
    header: "Address",
    columns: columnHelper.columns([
      columnHelper.accessor("address.city", {
        id: "city",
        header: (c) => <c.header.ColumnHeader label="City" />,
        cell: (c) => c.getValue(),

        filterFn: "string",

        minSize: 150,
        size: 150,

        meta: {
          label: "City",
        },
      }),
      columnHelper.accessor("address.country", {
        id: "country",
        header: (c) => <c.header.ColumnHeader label="Country" />,
        cell: (c) => c.getValue(),

        filterFn: "string",

        minSize: 150,
        size: 150,

        meta: {
          label: "Country",
        },
      }),
    ]),

    meta: {
      label: "Address",
      headerProps: { className: "text-center" },
    },
  }),
  columnHelper.accessor("projects", {
    header: (c) => <c.header.ColumnHeader label="Projects" />,
    cell: (c) => c.getValue().join(", "),

    filterFn: "string",

    minSize: 500,
    size: 500,

    meta: {
      label: "Projects",
      icon: FoldersIcon,
    },
  }),
]);
