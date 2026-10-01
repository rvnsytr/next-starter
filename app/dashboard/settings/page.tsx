import { DashboardPage } from "@/core/components/layout/dashboard-page";
import { ThemeSettings } from "@/core/components/theme-settings";
import { THEME_TOGGLE_HOTKEY_DISPLAY } from "@/core/components/theme-toggle";
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
import { appConfig } from "@/shared/configs";
import { LockKeyholeIcon, ShieldIcon, SunMoonIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: getRouteTitle("/dashboard/settings"),
};

export default function Page() {
  return (
    <DashboardPage className="items-center">
      <Card id="theme" className="w-full lg:max-w-xl" asPageCard>
        <CardHeader>
          <CardTitle>
            <SunMoonIcon /> Theme
          </CardTitle>
          <CardDescription>
            Customize the look and feel of <b>{appConfig.name}</b> to match your
            preferences.
          </CardDescription>

          <CardAction>
            <Kbd className="hidden lg:inline-flex">
              {THEME_TOGGLE_HOTKEY_DISPLAY}
            </Kbd>
          </CardAction>
        </CardHeader>

        <CardContent>
          <ThemeSettings />
        </CardContent>
      </Card>

      <Card id="active-sessions" className="w-full lg:max-w-xl" asPageCard>
        <CardHeader>
          <CardTitle>
            <ShieldIcon /> Active sessions
          </CardTitle>
          <CardDescription>
            View and manage the sessions currently active on your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SessionList />
        </CardContent>

        <CardFooter className="*:w-full *:lg:w-fit">
          <RevokeOtherSessionsButton />
        </CardFooter>
      </Card>

      <Card id="change-password" className="w-full lg:max-w-xl" asPageCard>
        <CardHeader>
          <CardTitle>
            <LockKeyholeIcon /> Change password
          </CardTitle>
          <CardDescription>
            Use a strong password to keep your account secure.
          </CardDescription>
        </CardHeader>

        <ChangePasswordForm />
      </Card>
    </DashboardPage>
  );
}
