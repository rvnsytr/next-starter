import { DashboardPage } from "@/core/components/layout/dashboard-page";
import { themeHotkeyDisplay, ThemeSettings } from "@/core/components/theme";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Kbd } from "@/core/components/ui/kbd";
import { getRouteTitle } from "@/core/route";
import { ChangePasswordForm } from "@/modules/auth/components/change-password-form";
import { RevokeOtherSessionsButton } from "@/modules/auth/components/revoke-other-session-button";
import { SessionList } from "@/modules/auth/components/session-list";
import { appConfig } from "@/shared/config";
import { LockKeyholeIcon, ShieldIcon, SunMoonIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getRouteTitle("/dashboard/settings"),
};

export default function Page() {
  return (
    <DashboardPage className="items-center">
      <Card id="tema" className="w-full lg:max-w-xl" asPageCard>
        <CardHeader>
          <CardTitle>
            <SunMoonIcon /> Tema
          </CardTitle>
          <CardDescription>
            Sesuaikan tampilan dan nuansa <b>{appConfig.name}</b> sesuai
            preferensi Anda.
          </CardDescription>

          <CardAction>
            <Kbd className="hidden lg:inline-flex">{themeHotkeyDisplay}</Kbd>
          </CardAction>
        </CardHeader>

        <CardContent>
          <ThemeSettings />
        </CardContent>
      </Card>

      <Card id="sesi-aktif" className="w-full lg:max-w-xl" asPageCard>
        <CardHeader>
          <CardTitle>
            <ShieldIcon /> Sesi Aktif
          </CardTitle>
          <CardDescription>
            Lihat dan kelola sesi yang saat ini sedang aktif pada akun Anda.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SessionList />
        </CardContent>

        <CardFooter className="*:w-full *:lg:w-fit">
          <RevokeOtherSessionsButton />
        </CardFooter>
      </Card>

      <Card id="ubah-kata-sandi" className="w-full lg:max-w-xl" asPageCard>
        <CardHeader>
          <CardTitle>
            <LockKeyholeIcon /> Ubah Kata Sandi
          </CardTitle>
          <CardDescription>
            Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda.
          </CardDescription>
        </CardHeader>

        <ChangePasswordForm />
      </Card>
    </DashboardPage>
  );
}
