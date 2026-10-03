import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Marker, MarkerContent } from "@/core/components/ui/marker";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/core/components/ui/tabs";
import { getRouteTitle } from "@/core/route";
import { SignInForm } from "@/modules/auth/components/sign-in-form";
import { SignOnGithubButton } from "@/modules/auth/components/sign-on-github";
import { SignUpForm } from "@/modules/auth/components/sign-up-form";
import { LoadingFallback } from "@/shared/components/fallback";
import { FooterNote } from "@/shared/components/footer-note";
import { APP_NAME } from "@/shared/constants";
import { LogInIcon, UserRoundPlusIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = { title: getRouteTitle("/sign-in") };

export default function Page() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Card className="w-full max-w-lg" asPageCard>
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-lg font-semibold">
            <Link href="/">{APP_NAME}</Link>
          </CardTitle>
          <CardDescription>
            Sign in to {APP_NAME} securely using your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-4">
          <Tabs defaultValue="sign-in">
            <TabsList className="w-full">
              <TabsTab value="sign-in">
                <LogInIcon /> Sign in
              </TabsTab>
              <TabsTab value="sign-up">
                <UserRoundPlusIcon /> Sign up
              </TabsTab>
            </TabsList>

            <TabsPanel value="sign-in">
              <Suspense fallback={<LoadingFallback variant="frame" />}>
                <SignInForm />
              </Suspense>
            </TabsPanel>
            <TabsPanel value="sign-up">
              <SignUpForm />
            </TabsPanel>
          </Tabs>

          <Marker variant="separator">
            <MarkerContent className="text-xs">Or</MarkerContent>
          </Marker>

          <SignOnGithubButton />
        </CardContent>

        <CardFooter className="justify-center text-center">
          <FooterNote />
        </CardFooter>
      </Card>
    </div>
  );
}
