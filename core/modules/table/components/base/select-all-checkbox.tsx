import { Checkbox } from "@/core/components/ui/checkbox";
import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";
import { cn } from "@/core/utils";

export type SelectAllCheckboxProps = Omit<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "onCheckedChange" | "indeterminate"
>;

export function SelectAllCheckbox({
  tableType,
  className,
  ...props
}: SelectAllCheckboxProps & { tableType: DataTableType }) {
  const table = getTableHook(tableType).useTableContext();
  return (
    <table.Subscribe selector={(s) => s.rowSelection}>
      {() => {
        const isAllRowsSelected = table.getIsAllRowsSelected();
        const isSomePageRowsSelected = table.getIsSomePageRowsSelected();
        return (
          <Checkbox
            aria-label="Select all"
            checked={isAllRowsSelected}
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            indeterminate={!isAllRowsSelected && isSomePageRowsSelected}
            className={cn("mx-auto", className)}
            {...props}
          />
        );
      }}
    </table.Subscribe>
  );
}
