import { FooterNote } from "@/core/components/layout/footer-note";
import { PageCard } from "@/core/components/layout/page";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/core/components/ui/tabs";
import { getRouteTitle } from "@/core/route";
import { SignInForm } from "@/modules/auth/components/sign-in-form";
import { appConfig } from "@/shared/config";
import { LogInIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: getRouteTitle("/sign-in") };

export default function Page() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <PageCard className="w-full max-w-lg">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-lg font-semibold">
            <Link href="/">{appConfig.name}</Link>
          </CardTitle>
          <CardDescription>
            Masuk ke Dashboard {appConfig.name} dengan aman menggunakan akun
            Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-4">
          <Tabs defaultValue="masuk">
            <TabsList className="w-full">
              <TabsTab value="masuk">
                <LogInIcon /> Masuk
              </TabsTab>
              <TabsTab value="daftar">Daftar</TabsTab>
            </TabsList>

            <TabsPanel value="masuk">
              <SignInForm />
            </TabsPanel>
            <TabsPanel value="daftar">{/* <SignUpForm /> */}</TabsPanel>
          </Tabs>

          <div className="flex items-center gap-x-4">
            <div className="grow border-t before:border-t" />
            <small className="text-muted-foreground text-xs font-medium">
              Atau
            </small>
            <div className="grow border-t after:border-t" />
          </div>

          {/* <SignOnGithubButton /> */}
        </CardContent>

        <CardFooter className="justify-center text-center">
          <FooterNote />
        </CardFooter>
      </PageCard>
    </div>
  );
}
