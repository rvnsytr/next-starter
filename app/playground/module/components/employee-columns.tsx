import { CustomColorBadge } from "@/core/components/ui/badge";
import { dataTable } from "@/core/modules/table/hooks/data-table";
import { formatNumber } from "@/core/utils";
import { UserStatusBadge } from "@/modules/auth/components/user-status-badge";
import { formatDate } from "date-fns";
import { MailIcon, UserRoundIcon } from "lucide-react";
import { skillMeta, userRoleMeta } from "../constants";
import { Employee } from "../types";

const columnHelper = dataTable.createAppColumnHelper<Employee>();

export const employeeColumns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    header: (c) => <c.header.SelectAllCheckbox />,
    cell: (c) => <c.cell.RowCheckbox />,

    size: 50,
    enableHiding: false,
    enableSorting: false,
  }),
  columnHelper.display({
    id: "no",
    header: () => <div className="text-center">No</div>,
    cell: (c) => <c.cell.RowNumber />,

    size: 50,
    enableHiding: false,
    enableSorting: false,
  }),
  columnHelper.accessor("name", {
    header: (c) => (
      <div className="flex items-center gap-x-2">
        Name <c.header.SortButton />
      </div>
    ),
    cell: (c) => c.getValue(),

    meta: {
      label: "Name",
      icon: UserRoundIcon,
    },
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (c) => c.getValue(),

    meta: {
      label: "Email Address",
      icon: MailIcon,
    },
  }),
  columnHelper.accessor("age", {
    header: "Age",
    cell: (c) => formatNumber(c.getValue()),
    meta: {
      label: "Age",
    },
  }),
  columnHelper.accessor("salary", {
    header: "Salary",
    cell: (c) => formatNumber(c.getValue()),
    meta: {
      label: "Salary Amount",
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Join Date",
    cell: (c) => formatDate(c.getValue(), "PPPp"),
    meta: {
      label: "Join Date",
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (c) => <UserStatusBadge value={c.getValue()} />,
    meta: {
      label: "User Status",
    },
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (c) => {
      const { color } = userRoleMeta[c.getValue()];
      return <CustomColorBadge color={color}>{c.getValue()}</CustomColorBadge>;
    },
    meta: {
      label: "Role",
    },
  }),
  columnHelper.accessor("skills", {
    header: "Skills",
    cell: (c) =>
      c.getValue().map((item) => {
        const { color } = skillMeta[item];
        return (
          <CustomColorBadge key={item} color={color}>
            {item}
          </CustomColorBadge>
        );
      }),
    meta: {
      label: "Skills",
    },
  }),
  columnHelper.accessor("department", {
    header: "Department",
    cell: (c) => c.getValue(),
    meta: {
      label: "Department",
    },
  }),
  columnHelper.accessor("manager", {
    header: "Manager Name",
    cell: (c) => c.getValue() ?? "-",
    meta: {
      label: "Manager Name",
    },
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
    cell: (c) => c.getValue() ?? "-",
    meta: {
      label: "Phone Number",
    },
  }),
  columnHelper.group({
    header: "Address",
    columns: [
      columnHelper.accessor((ac) => ac.address.city as unknown, {
        id: "city",
        header: "City",
        cell: (c) => c.getValue(),

        meta: {
          label: "City",
        },
      }),
      columnHelper.accessor((ac) => ac.address.country as unknown, {
        id: "country",
        header: "Country",
        cell: (c) => c.getValue(),
        meta: {
          label: "Country",
        },
      }),
    ],

    meta: {
      label: "Address",
    },
  }),
  columnHelper.accessor("projects", {
    header: "Projects",
    cell: (c) => c.getValue().join(", "),
    meta: {
      label: "Projects",
    },
  }),
]);
