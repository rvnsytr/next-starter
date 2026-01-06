import { DashboardMain } from "@/core/components/layout";
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
import { LayoutSettings } from "@/core/components/ui/layout";
import { ThemeSettings } from "@/core/components/ui/theme";
import { appMeta } from "@/core/constants";
import { getRouteTitle } from "@/core/utils";
import {
  ChangePasswordForm,
  RevokeOtherSessionsButton,
  SessionList,
} from "@/modules/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getRouteTitle("/dashboard/profile"),
};

export default function Page() {
  return (
    <DashboardMain className="items-center" noLayoutLoader>
      <Card id="tema" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle>Tema</CardTitle>
          <CardDescription>
            Sesuaikan tampilan dan nuansa{" "}
            <span className="text-foreground font-medium">{appMeta.name}</span>{" "}
            sesuai preferensi Anda.
          </CardDescription>

          <CardAction>
            <KbdGroup>
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

      <Card id="layout" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle>Layout</CardTitle>
          <CardDescription>
            Atur tata letak antarmuka{" "}
            <span className="text-foreground font-medium">{appMeta.name}</span>{" "}
            sesuai keinginan Anda.
          </CardDescription>
          <CardAction>
            <KbdGroup>
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

      <Card id="sesi-aktif" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle>Sesi Aktif</CardTitle>
          <CardDescription>
            Tinjau dan kelola sesi yang saat ini sedang masuk ke akun Anda.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SessionList />
        </CardContent>

        <CardFooter className="*:w-full *:lg:w-fit">
          <RevokeOtherSessionsButton />
        </CardFooter>
      </Card>

      <Card id="ubah-kata-sandi" className="w-full scroll-m-20 lg:max-w-2xl">
        <CardHeader>
          <CardTitle>Ubah Kata Sandi</CardTitle>
          <CardDescription>
            Gunakan kata sandi yang kuat untuk menjaga keamanan akun Anda.
          </CardDescription>
        </CardHeader>

        <ChangePasswordForm />
      </Card>
    </DashboardMain>
  );
}
