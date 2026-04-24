import {
  PageContainer,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/core/components/layout/page";
import { Button } from "@/core/components/ui/button";
import { CardAction } from "@/core/components/ui/card";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { Separator } from "@/core/components/ui/separator";
import { getRouteTitle } from "@/core/route";
import { CreateUserDialog } from "@/modules/auth/components/create-user-dialog";
import { EllipsisIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = { title: getRouteTitle("/dashboard/users") };

export default function Page() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Manajemen Pengguna</PageTitle>
        <PageDescription>
          Kelola dan lihat detail semua pengguna yang telah terdaftar.
        </PageDescription>

        <CardAction className="flex lg:hidden">
          <Popover>
            <PopoverTrigger
              render={
                <Button size="icon-sm" variant="outline">
                  <EllipsisIcon />
                </Button>
              }
            />

            <PopoverPopup align="end" className="grid gap-y-1 p-1">
              <CreateUserDialog
                size="sm"
                variant="ghost"
                className="justify-start"
              />
            </PopoverPopup>
          </Popover>
        </CardAction>

        <CardAction className="hidden lg:flex">
          <CreateUserDialog />
        </CardAction>
      </PageHeader>

      <Separator />

      {/* <UserDataTable /> */}
    </PageContainer>
  );
}
