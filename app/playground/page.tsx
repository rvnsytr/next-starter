import { Tabs, TabsList, TabsPanel, TabsTab } from "@/core/components/ui/tabs";
import { Table2Icon, TableIcon } from "lucide-react";
import { EmployeeDataTable } from "./module/components/employee-tables";

export default function Page() {
  return (
    <Tabs className="container min-h-dvh px-0 py-8 lg:border-x">
      <TabsList className="mx-4">
        <TabsTab value="data-table">
          <TableIcon /> Data Table
        </TabsTab>
        <TabsTab value="data-grid">
          <Table2Icon /> Data Grid
        </TabsTab>
      </TabsList>

      <TabsPanel value="data-table" className="border-y border-dashed py-4">
        <EmployeeDataTable />
      </TabsPanel>
    </Tabs>
  );
}
