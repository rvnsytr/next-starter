import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/core/components/layout/page";
import { CardAction } from "@/core/components/ui/card";
import { Separator } from "@/core/components/ui/separator";
import { getRouteTitle } from "@/core/route";
import { CreateUserDialog } from "@/modules/auth/components/create-user-dialog";
import { UserDataTable } from "@/modules/auth/components/user-data-table";
import { Metadata } from "next";

export const metadata: Metadata = { title: getRouteTitle("/dashboard/users") };

export default function Page() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Manajemen Pengguna</PageTitle>
        <PageDescription>
          Kelola dan lihat detail semua pengguna yang telah terdaftar.
        </PageDescription>

        <CardAction>
          <CreateUserDialog />
        </CardAction>
      </PageHeader>

      <Separator />

      <UserDataTable />
    </PageContainer>
  );
}
