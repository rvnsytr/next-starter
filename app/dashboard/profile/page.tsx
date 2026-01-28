import { DashboardMain } from "@/core/components/layout/dashboard";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { appMeta } from "@/core/constants/app";
import { getRouteTitle } from "@/core/route";
import { ProfileBadges, ProfileForm } from "@/modules/auth/components.client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getRouteTitle("/dashboard/profile"),
};

export default function Page() {
  return (
    <DashboardMain className="items-center" noLayoutLoader>
      <Card id="informasi-pribadi" className="w-full scroll-m-20 lg:max-w-2xl">
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
    </DashboardMain>
  );
}
