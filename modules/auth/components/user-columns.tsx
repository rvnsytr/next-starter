import { User } from "@/core/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import {
  ColumnCellCheckbox,
  ColumnCellNumber,
  ColumnHeader,
  ColumnHeaderCheckbox,
} from "@/core/components/ui/column";
import { DataControllerResult } from "@/core/hooks/use-data-controller";
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
import { roleConfig } from "../config/role";
import {
  allUserStatus,
  getUserStatus,
  userStatusConfig,
} from "../config/user-status";
import { RoleBadge } from "./role-badge";
import { UserRoleColumn } from "./user-role-column";
import { UserStatusBadge } from "./user-status-badge";
import { UserVerifiedBadge } from "./user-verified-badge";

const createColumn = createColumnHelper<User>();
export const getUserColumns = (result?: DataControllerResult<User>) => [
  createColumn.display({
    id: "select",
    header: (c) => <ColumnHeaderCheckbox table={c.table} />,
    cell: (c) => <ColumnCellCheckbox row={c.row} />,
    enableHiding: false,
    enableSorting: false,
  }),
  createColumn.display({
    id: "no",
    header: "No",
    cell: (c) => <ColumnCellNumber table={c.table} row={c.row} />,
    enableHiding: false,
  }),
  createColumn.accessor((ac) => ac.name, {
    id: "name",
    header: (c) => (
      <ColumnHeader column={c.column} disabled={result?.isLoading}>
        Nama
      </ColumnHeader>
    ),
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
    filterFn: filterFn("text"),
    meta: { label: "Nama", type: "text", icon: UserRoundIcon },
  }),
  createColumn.accessor((ac) => ac.email, {
    id: "email",
    header: (c) => (
      <ColumnHeader column={c.column} disabled={result?.isLoading}>
        Alamat Email
      </ColumnHeader>
    ),
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
    header: (c) => (
      <ColumnHeader column={c.column} disabled={result?.isLoading}>
        Status
      </ColumnHeader>
    ),
    cell: (c) => <UserStatusBadge value={c.cell.getValue()} />,
    filterFn: filterFn("option"),
    meta: {
      label: "Status",
      type: "option",
      icon: CircleDotIcon,
      options: allUserStatus.map((value) => {
        const { label, icon } = userStatusConfig[value];
        const count = result?.data?.count?.[value] ?? undefined;
        return { value, label, icon, count };
      }),
    },
  }),
  createColumn.accessor((ac) => ac.role, {
    id: "role",
    header: (c) => (
      <ColumnHeader column={c.column} disabled={result?.isLoading}>
        Role
      </ColumnHeader>
    ),
    cell: (c) => (
      <div className="flex items-center gap-2">
        <UserRoleColumn data={c.row.original} />
        <RoleBadge value={c.cell.getValue()} />
      </div>
    ),
    filterFn: filterFn("option"),
    meta: {
      label: "Role",
      type: "option",
      icon: ShieldUserIcon,
      options: allRoles.map((value) => {
        const { label, icon } = roleConfig[value];
        const count = result?.data?.count?.[value] ?? undefined;
        return { value, label, icon, count };
      }),
    },
  }),
  createColumn.accessor((ac) => ac.updatedAt, {
    id: "updatedAt",
    header: (c) => (
      <ColumnHeader column={c.column} disabled={result?.isLoading}>
        Terakhir Diperbarui
      </ColumnHeader>
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
    header: (c) => (
      <ColumnHeader column={c.column} disabled={result?.isLoading}>
        Waktu Dibuat
      </ColumnHeader>
    ),
    cell: (c) => formatLocalizedDate(c.cell.getValue(), "PPPp"),
    filterFn: filterFn("date"),
    meta: { label: "Waktu Dibuat", type: "date", icon: CalendarCheck2Icon },
  }),
];
