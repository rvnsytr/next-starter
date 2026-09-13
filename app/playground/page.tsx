import {
  DashboardPageDescription,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/core/components/layout/dashboard-page";
import { ThemeToggle } from "@/core/components/theme-toggle";
import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";
import { LinkSpinner } from "@/core/components/ui/spinner";
import { cn } from "cn";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { SaleDataGrid } from "./module/components/sales-tables";

export default function Page() {
  return (
    <div
      className={cn(
        "flex flex-col gap-y-4 px-0 py-4",
        "*:data-[slot=separator]:border-t *:data-[slot=separator]:border-dashed *:data-[slot=separator]:bg-transparent",
      )}
    >
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

      <DashboardPageHeader>
        <DashboardPageTitle>Data Table</DashboardPageTitle>
        <DashboardPageDescription>
          Built using{" "}
          <Link href="https://tanstack.com/table/latest" target="_blank">
            Tanstack Table v9
          </Link>
        </DashboardPageDescription>
      </DashboardPageHeader>

      <Separator />

      <SaleDataGrid />
    </div>
  );
}
