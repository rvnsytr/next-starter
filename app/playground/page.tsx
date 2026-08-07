import { EmployeeDataTable } from "./module/components/employee-tables";

export default function Page() {
  return (
    <div className="container flex min-h-dvh flex-col gap-y-4 px-0 py-8 lg:border-x">
      <div className="border-y border-dashed py-4">
        <EmployeeDataTable />
      </div>
    </div>
  );
}
