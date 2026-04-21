import { LayoutSettings } from "@/core/components/layout";
import { PageContainer } from "@/core/components/layout/page";
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
import { Kbd, KbdGroup } from "@/core/components/ui/kbd";
import { getRouteTitle } from "@/core/route";
import { ChangePasswordForm } from "@/modules/auth/components/change-password-form";
import { appConfig } from "@/shared/config";
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
    <PageContainer className="items-center px-0">
      <Card id="tema" className="w-full lg:max-w-2xl" asPageCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <SunMoonIcon /> Tema
          </CardTitle>
          <CardDescription>
            Sesuaikan tampilan dan nuansa{" "}
            <span className="text-foreground font-medium">
              {appConfig.name}
            </span>{" "}
            sesuai preferensi Anda.
          </CardDescription>

          <CardAction>
            <KbdGroup className="hidden lg:inline-flex">
              <Kbd>Alt</Kbd>
              <span className="font-light">+</span>
              <Kbd>T</Kbd>
            </KbdGroup>
          </CardAction>
        </CardHeader>

        <CardContent>
          <ThemeSettings />
        </CardContent>
      </Card>

      <Card id="layout" className="w-full lg:max-w-2xl" asPageCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <FrameIcon /> Layout
          </CardTitle>
          <CardDescription>
            Sesuaikan tata letak antarmuka{" "}
            <span className="text-foreground font-medium">
              {appConfig.name}
            </span>{" "}
            sesuai preferensi Anda. Perubahan ini berlaku pada layar dengan
            lebar lebih dari <code>1024px</code>.
          </CardDescription>
          <CardAction>
            <KbdGroup className="hidden lg:inline-flex">
              <Kbd>Alt</Kbd>
              <span className="font-light">+</span>
              <Kbd>L</Kbd>
            </KbdGroup>
          </CardAction>
        </CardHeader>

        <CardContent>
          <LayoutSettings />
        </CardContent>
      </Card>

      <Card id="sesi-aktif" className="w-full lg:max-w-2xl" asPageCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <ShieldIcon /> Sesi Aktif
          </CardTitle>
          <CardDescription>
            Lihat dan kelola sesi yang saat ini sedang aktif pada akun Anda.
          </CardDescription>
        </CardHeader>

        <CardContent>{/* <SessionList /> */}</CardContent>

        <CardFooter className="*:w-full *:lg:w-fit">
          {/* <RevokeOtherSessionsButton /> */}
        </CardFooter>
      </Card>

      <Card id="ubah-kata-sandi" className="w-full lg:max-w-2xl" asPageCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
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
