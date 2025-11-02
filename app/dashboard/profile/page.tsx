import { DashboardMain } from "@/components/layouts/dashboard";
import { UserRoleBadge, UserVerifiedBadge } from "@/components/modules/user";
import {
  ChangePasswordForm,
  DeleteMyAccountButton,
  PersonalInformation,
  RevokeOtherSessionsButton,
  RevokeSessionButton,
} from "@/components/modules/user-client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appMeta } from "@/constants";
import { Role } from "@/lib/permission";
import { getListSession, requireAuth } from "@/server/action";
import { getTitle } from "@/utils";
import { Metadata } from "next";

export const metadata: Metadata = { title: getTitle("/dashboard/profile") };

export default async function Page() {
  const { session, meta } = await requireAuth("/dashboard/profile");
  const sessionList = await getListSession();

  return (
    <DashboardMain currentPage={meta.displayName} className="items-center">
      <Card id="informasi-pribadi" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>Informasi Pribadi</CardTitle>
          <CardDescription>
            Perbarui dan kelola informasi profil {appMeta.name} Anda.
          </CardDescription>
          <CardAction className="flex flex-col items-end gap-2 md:flex-row-reverse">
            <UserRoleBadge role={session.user.role as Role} />
            {session.user.emailVerified && <UserVerifiedBadge />}
          </CardAction>
        </CardHeader>

        <PersonalInformation {...session.user} />
      </Card>

      <Card id="ubah-kata-sandi" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>Ubah Kata Sandi</CardTitle>
          <CardDescription>
            Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda.
          </CardDescription>
        </CardHeader>

        <ChangePasswordForm />
      </Card>

      <Card id="sesi-aktif" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>Sesi Aktif</CardTitle>
          <CardDescription>
            Tinjau dan kelola sesi yang saat ini sedang masuk ke akun Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-2">
          {sessionList.map((item) => (
            <RevokeSessionButton
              key={item.id}
              currentSessionId={session.session.id}
              {...item}
            />
          ))}
        </CardContent>

        <CardFooter className="flex-col items-stretch border-t md:flex-row md:items-center">
          <RevokeOtherSessionsButton />
        </CardFooter>
      </Card>

      <Card id="hapus-akun" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle className="text-destructive">Hapus Akun</CardTitle>
          <CardDescription>
            Peringatan: Tindakan ini bersifat permanen dan tidak dapat
            dibatalkan.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DeleteMyAccountButton {...session.user} />
        </CardContent>
      </Card>
    </DashboardMain>
  );
}
