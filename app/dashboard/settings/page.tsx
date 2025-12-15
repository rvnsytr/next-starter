import { DashboardMain } from "@/core/components/layouts";
import {
  LayoutSettings,
  ThemeSettings,
} from "@/core/components/ui/buttons.client";
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
    <DashboardMain className="items-center">
      <Card id="tema" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
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

      <Card id="layout" className="w-full scroll-m-20 lg:max-w-xl">
        <CardHeader className="border-b">
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

        <CardFooter className="border-t *:w-full *:lg:w-fit">
          <RevokeOtherSessionsButton />
        </CardFooter>
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
    </DashboardMain>
  );
}
