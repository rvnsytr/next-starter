import { EmployeeDataTable } from "./module/components/employee-data-table";

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-y-4 py-20">
      <EmployeeDataTable />
    </div>
  );
}
