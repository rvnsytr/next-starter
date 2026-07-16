import {
  DashboardPage,
  DashboardPageDescription,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/core/components/layout/dashboard-page";
import { CardAction } from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import { getRouteTitle } from "@/core/route";
import { CreateUserDialog } from "@/modules/auth/components/create-user-dialog";
import { UserDataTable } from "@/modules/auth/components/user-data-table";
import { Metadata } from "next";

export const metadata: Metadata = { title: getRouteTitle("/dashboard/users") };

export default function Page() {
  return (
    <DashboardPage className="px-0">
      <DashboardPageHeader className="px-4">
        <DashboardPageTitle>Manajemen Pengguna</DashboardPageTitle>
        <DashboardPageDescription>
          Kelola dan lihat detail semua pengguna yang telah terdaftar.
        </DashboardPageDescription>

        <CardAction>
          <CreateUserDialog />
        </CardAction>
      </DashboardPageHeader>

      <Separator />

      <UserDataTable />
    </DashboardPage>
  );
}
