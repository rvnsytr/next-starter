import { AuthSession } from "@/core/auth";
import { ColumnCellNumber, ColumnHeader } from "@/core/components/ui/column";
import { filterFn, formatLocalizedDate } from "@/core/utils";
import { allRoles } from "@/shared/permission";
import { createColumnHelper } from "@tanstack/react-table";
import {
  CalendarCheck2Icon,
  CalendarSyncIcon,
  CircleDotIcon,
  MailIcon,
  ShieldUserIcon,
  UserRoundIcon,
} from "lucide-react";
import {
  allUserStatus,
  getUserStatus,
  roleConfig,
  userStatusConfig,
} from "../config";
import { UserRoleBadge } from "./user-role-badge";
import { UserStatusBadge } from "./user-status-badge";
import { UserVerifiedBadge } from "./user-verified-badge";

const createColumn = createColumnHelper<AuthSession["user"]>();
export const getUserColumns = (
  //   currentUserId: string,
  result?: { count?: Record<string, number> },
) => [
  //   createColumn.display({
  //     id: "select",
  //     header: (c) => (
  //       <ColumnHeaderCheckbox table={c.table}  />
  //     ),
  //     cell: (c) => <ColumnCellCheckbox row={c.row} />,
  //     enableHiding: false,
  //     enableSorting: false,
  //   }),
  createColumn.display({
    id: "no",
    header: "No",
    cell: (c) => <ColumnCellNumber table={c.table} row={c.row} />,
    enableHiding: false,
  }),
  createColumn.accessor((ac) => ac.name, {
    id: "name",
    header: (c) => <ColumnHeader column={c.column}>Nama</ColumnHeader>,
    cell: (c) => c.getValue(),
    // cell: (c) => (
    //   <UserDetailModal
    //     data={c.row.original}
    //     isCurrentUser={c.row.original.id === currentUserId}
    //   />
    // ),
    filterFn: filterFn("text"),
    meta: { label: "Nama", type: "text", icon: UserRoundIcon },
  }),
  createColumn.accessor((ac) => ac.email, {
    id: "email",
    header: (c) => <ColumnHeader column={c.column}>Alamat Email</ColumnHeader>,
    cell: (c) => (
      <div className="flex items-center gap-x-2">
        {c.cell.getValue()}
        {c.row.original.emailVerified && <UserVerifiedBadge withText={false} />}
      </div>
    ),
    filterFn: filterFn("text"),
    meta: { label: "Alamat Email", type: "text", icon: MailIcon },
  }),
  createColumn.accessor((ac) => getUserStatus(ac), {
    id: "status",
    header: (c) => <ColumnHeader column={c.column}>Status</ColumnHeader>,
    cell: (c) => <UserStatusBadge value={c.cell.getValue()} />,
    filterFn: filterFn("option"),
    meta: {
      label: "Status",
      type: "option",
      icon: CircleDotIcon,
      options: allUserStatus.map((value) => {
        const { label, icon } = userStatusConfig[value];
        const count = result?.count?.[value];
        return { value, label, icon, count };
      }),
    },
  }),
  createColumn.accessor((ac) => ac.role, {
    id: "role",
    header: (c) => <ColumnHeader column={c.column}>Role</ColumnHeader>,
    cell: (c) => <UserRoleBadge value={c.cell.getValue()} />,
    filterFn: filterFn("option"),
    meta: {
      label: "Role",
      type: "option",
      icon: ShieldUserIcon,
      options: allRoles.map((value) => {
        const { label, icon } = roleConfig[value];
        const count = result?.count?.[value];
        return { value, label, icon, count };
      }),
    },
  }),
  createColumn.accessor((ac) => ac.updatedAt, {
    id: "updatedAt",
    header: (c) => (
      <ColumnHeader column={c.column}>Terakhir Diperbarui</ColumnHeader>
    ),
    cell: (c) => formatLocalizedDate(c.cell.getValue(), "PPPp"),
    filterFn: filterFn("date"),
    meta: {
      label: "Terakhir Diperbarui",
      type: "date",
      icon: CalendarSyncIcon,
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
