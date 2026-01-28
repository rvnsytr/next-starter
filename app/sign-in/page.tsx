import { FooterNote } from "@/core/components/layout/footer-note";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { appMeta } from "@/core/constants/app";
import { getRouteTitle } from "@/core/route";
import {
  SignInForm,
  SignOnGithubButton,
  SignUpForm,
} from "@/modules/auth/components.client";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: getRouteTitle("/sign-in") };

export default function Page() {
  return (
    <main className="container flex min-h-dvh items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="mx-auto">
            <Link href="/">
              <h3>{appMeta.name}</h3>
            </Link>
          </CardTitle>
          <CardDescription>
            Masuk ke Dashboard {appMeta.name} dengan aman menggunakan akun Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-y-4">
          <Tabs defaultValue="masuk">
            <TabsList className="w-full">
              <TabsTrigger value="masuk">Masuk</TabsTrigger>
              <TabsTrigger value="daftar">Daftar</TabsTrigger>
            </TabsList>

            <TabsContent value="masuk">
              <SignInForm />
            </TabsContent>
            <TabsContent value="daftar">
              <SignUpForm />
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-x-4">
            <div className="grow border-t before:border-t" />
            <small className="text-muted-foreground text-xs font-medium">
              Atau
            </small>
            <div className="grow border-t after:border-t" />
          </div>

          <SignOnGithubButton />
        </CardContent>

        <CardFooter className="justify-center text-center">
          <FooterNote />
        </CardFooter>
      </Card>
    </main>
  );
}
