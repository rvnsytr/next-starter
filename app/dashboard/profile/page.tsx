import { PageContainer } from "@/core/components/layout/page";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { getRouteTitle } from "@/core/route";
import { ProfileBadges } from "@/modules/auth/components/profile-badges";
import { ProfileForm } from "@/modules/auth/components/profile-form";
import { appConfig } from "@/shared/config";
import { UserRoundIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getRouteTitle("/dashboard/profile"),
};

export default function Page() {
  return (
    <PageContainer className="items-center px-0">
      <Card id="informasi-pribadi" className="w-full lg:max-w-xl" asPageCard>
        <CardHeader className="border-b">
          <CardTitle>
            <UserRoundIcon /> Informasi Pribadi
          </CardTitle>
          <CardDescription>
            Perbarui dan kelola informasi profil {appConfig.name} Anda.
          </CardDescription>
          <CardAction className="flex flex-col items-end gap-2 md:flex-row-reverse">
            <ProfileBadges />
          </CardAction>
        </CardHeader>

        <ProfileForm />
      </Card>
    </PageContainer>
  );
}
