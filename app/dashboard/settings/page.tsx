import { LayoutModeSettings } from "@/core/components/layout-mode";
import { PageContainer } from "@/core/components/page";
import { ThemeSettings } from "@/core/components/theme";
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
import {
  appConfig,
  layoutModeToggleConfig,
  themeToggleConfig,
} from "@/shared/config";
import {
  FrameIcon,
  LockKeyholeIcon,
  ShieldIcon,
  SunMoonIcon,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getRouteTitle("/dashboard/profile"),
};

export default function Page() {
  return (
    <PageContainer className="items-center">
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
            <Kbd className="hidden lg:inline-flex">
              {themeToggleConfig.hotkeyDisplay}
            </Kbd>
          </CardAction>
        </CardHeader>

        <CardContent>
          <ThemeSettings />
        </CardContent>
      </Card>

      <Card id="layout" className="w-full lg:max-w-xl" asPageCard>
        <CardHeader>
          <CardTitle>
            <FrameIcon /> Layout
          </CardTitle>
          <CardDescription>
            Sesuaikan tata letak antarmuka <b>{appConfig.name}</b> sesuai
            preferensi Anda. Perubahan ini berlaku pada layar dengan lebar lebih
            dari <code>1024px</code>.
          </CardDescription>

          <CardAction>
            <Kbd className="hidden lg:inline-flex">
              {layoutModeToggleConfig.hotkeyDisplay}
            </Kbd>
          </CardAction>
        </CardHeader>

        <CardContent>
          <LayoutModeSettings />
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
    </PageContainer>
  );
}
