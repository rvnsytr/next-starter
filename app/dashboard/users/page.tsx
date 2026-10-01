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
import { UsersDataGrid } from "@/modules/auth/components/user-data-grid";
import { Metadata } from "next";

export const metadata: Metadata = { title: getRouteTitle("/dashboard/users") };

export default function Page() {
  return (
    <DashboardPage className="px-0">
      <DashboardPageHeader className="px-4">
        <DashboardPageTitle>User management</DashboardPageTitle>
        <DashboardPageDescription>
          Manage and view details for all registered users.
        </DashboardPageDescription>

        <CardAction>
          <CreateUserDialog />
        </CardAction>
      </DashboardPageHeader>

      <Separator />

      <UsersDataGrid />
    </DashboardPage>
  );
}
