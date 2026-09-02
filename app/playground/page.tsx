import {
  DashboardPageDescription,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/core/components/layout/dashboard-page";
import { ThemeToggle } from "@/core/components/theme-toggle";
import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";
import { LinkSpinner } from "@/core/components/ui/spinner";
import { cn } from "@/core/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { SaleDataGrid } from "./module/components/sales-tables";

export default function Page() {
  return (
    <div
      className={cn(
        "container flex min-h-dvh flex-col gap-y-4 px-0 py-8 lg:border-x",
        "*:data-[slot=separator]:border-t *:data-[slot=separator]:border-dashed *:data-[slot=separator]:bg-transparent",
      )}
    >
      <Separator />

      <div className="flex justify-between gap-4 px-4">
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/">
              <LinkSpinner icon={{ base: <ArrowLeftIcon /> }} /> Back
            </Link>
          }
        />

        <ThemeToggle variant="outline" />
      </div>

      <Separator />

      <DashboardPageHeader className="mx-4">
        <DashboardPageTitle>Data Table</DashboardPageTitle>
        <DashboardPageDescription>
          Built using{" "}
          <Link href="https://tanstack.com/table/latest" target="_blank">
            Tanstack Table v9
          </Link>
        </DashboardPageDescription>
      </DashboardPageHeader>

      <Separator />

      {/* <SaleDataController /> */}

      {/* <Separator  /> */}

      {/* <SaleDataTable /> */}

      {/* <Separator  /> */}

      <SaleDataGrid />
    </div>
  );
}
