import {
  DashboardPageDescription,
  DashboardPageHeader,
  DashboardPageTitle,
} from "@/core/components/layout/dashboard-page";
import { Separator } from "@/core/components/ui/separator";
import Link from "next/link";
import { SaleDataTable } from "./module/components/sales-tables";

export default function Page() {
  return (
    <div className="container flex min-h-dvh flex-col gap-y-4 px-0 py-8 lg:border-x">
      <Separator className="border-t border-dashed bg-transparent" />

      <DashboardPageHeader className="mx-4">
        <DashboardPageTitle>Data Table</DashboardPageTitle>
        <DashboardPageDescription>
          Built using{" "}
          <Link href="https://tanstack.com/table/latest" target="_blank">
            Tanstack Table v9
          </Link>
        </DashboardPageDescription>
      </DashboardPageHeader>

      <Separator className="border-t border-dashed bg-transparent" />

      {/* <SaleDataController /> */}

      {/* <Separator className="border-t border-dashed bg-transparent" /> */}

      <SaleDataTable />

      {/* <Separator className="border-t border-dashed bg-transparent" /> */}

      {/* <SaleDataGrid /> */}
    </div>
  );
}
