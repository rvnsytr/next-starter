import { Checkbox } from "@/core/components/ui/checkbox";
import { DataTableType } from "@/core/modules/table/types";
import { getTableHook } from "@/core/modules/table/utils";
import { cn } from "@/core/utils";

export type RowCheckboxProps = Omit<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "onCheckedChange"
>;

export function RowCheckbox({
  tableType,
  className,
  disabled = false,
  ...props
}: React.ComponentProps<typeof Checkbox> & { tableType: DataTableType }) {
  const tableHook = getTableHook(tableType);

  const table = tableHook.useTableContext();
  const cell = tableHook.useCellContext();

  return (
    <table.Subscribe selector={(s) => s.rowSelection[cell.row.id] ?? false}>
      {(selected) => (
        <Checkbox
          aria-label="Select row"
          checked={selected}
          onCheckedChange={(value) => cell.row.toggleSelected(!!value)}
          disabled={disabled || !cell.row.getCanSelect()}
          className={cn("mx-auto", className)}
          {...props}
        />
      )}
    </table.Subscribe>
  );
}
