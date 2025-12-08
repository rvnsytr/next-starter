import { DashboardMain } from "@/core/components/layouts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { appMeta } from "@/core/constants";
import { getRouteTitle } from "@/core/utils";
import {
  ChangePasswordForm,
  ProfileBadges,
  ProfileForm,
  RevokeOtherSessionsButton,
  SessionList,
} from "@/modules/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getRouteTitle("/dashboard/profile"),
};

export default function Page() {
  return (
    <DashboardMain className="items-center">
      <Card id="informasi-pribadi" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
          <CardTitle>Informasi Pribadi</CardTitle>
          <CardDescription>
            Perbarui dan kelola informasi profil {appMeta.name} Anda.
          </CardDescription>
          <CardAction className="flex flex-col items-end gap-2 md:flex-row-reverse">
            <ProfileBadges />
          </CardAction>
        </CardHeader>

        <ProfileForm />
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
          <SessionList />
        </CardContent>

        <CardFooter className="flex-col items-stretch border-t md:flex-row md:items-center">
          <RevokeOtherSessionsButton />
        </CardFooter>
      </Card>
    </DashboardMain>
  );
}
