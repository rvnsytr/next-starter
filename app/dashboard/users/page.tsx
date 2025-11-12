import { DashboardMain } from "@/components/layouts/dashboard";
import {
  AdminCreateUserDialog,
  UserDataTable,
} from "@/components/modules/user-client";
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserList, requireAuth } from "@/server/action";
import { getTitle } from "@/utils";
import { Metadata } from "next";

export const metadata: Metadata = { title: getTitle("/dashboard/users") };

export default async function Page() {
  const { session, meta } = await requireAuth("/dashboard/users");
  const data = await getUserList();

  return (
    <DashboardMain currentPage={meta.displayName} className="pt-6">
      <CardHeader asPageHeader>
        <CardTitle>Manajemen {meta.displayName}</CardTitle>
        <CardDescription>
          Kelola dan lihat detail semua pengguna yang telah terdaftar.
        </CardDescription>
        <CardAction asPageAction>
          <AdminCreateUserDialog />
        </CardAction>
      </CardHeader>

      <Separator />

      <UserDataTable data={data.users} currentUserId={session.user.id} />
    </DashboardMain>
  );
}
