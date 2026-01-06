import { DashboardMain } from "@/core/components/layout";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { appMeta } from "@/core/constants";
import { getRouteTitle } from "@/core/utils";
import { ProfileBadges, ProfileForm } from "@/modules/auth";
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
