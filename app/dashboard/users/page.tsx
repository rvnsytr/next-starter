import { DashboardMain } from "@/core/components/layouts";
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import { getRouteTitle } from "@/core/utils";
import { AdminCreateUserDialog, UserDataTable } from "@/modules/auth";
import { Metadata } from "next";

export const metadata: Metadata = { title: getRouteTitle("/dashboard/users") };

export default function Page() {
  return (
    <DashboardMain className="pt-6">
      <CardHeader asPageHeader>
        <CardTitle>Manajemen Pengguna</CardTitle>
        <CardDescription>
          Kelola dan lihat detail semua pengguna yang telah terdaftar.
        </CardDescription>
        <CardAction asPageAction>
          <AdminCreateUserDialog />
        </CardAction>
      </CardHeader>

      <Separator />

      <UserDataTable />
    </DashboardMain>
  );
}
