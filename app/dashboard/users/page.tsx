import {
  ContentLayout,
  ContentLayoutAction,
  ContentLayoutDescription,
  ContentLayoutHeader,
  ContentLayoutTitle,
} from "@/core/components/layout/content-layout";
import { Separator } from "@/core/components/ui/separator";
import { getRouteTitle } from "@/core/route";
import { CreateUserDialog } from "@/modules/auth/components/create-user-dialog";
import { UsersDataGrid } from "@/modules/auth/components/user-data-grid";
import { Metadata } from "next";

export const metadata: Metadata = { title: getRouteTitle("/dashboard/users") };

export default function Page() {
  return (
    <ContentLayout className="px-0">
      <ContentLayoutHeader className="px-4">
        <ContentLayoutTitle>User management</ContentLayoutTitle>
        <ContentLayoutDescription>
          Manage and view details for all registered users.
        </ContentLayoutDescription>

        <ContentLayoutAction>
          <CreateUserDialog />
        </ContentLayoutAction>
      </ContentLayoutHeader>

      <Separator />

      <UsersDataGrid />
    </ContentLayout>
  );
}
