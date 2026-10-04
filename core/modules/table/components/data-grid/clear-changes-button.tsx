import { useDataGrid } from "./provider";

import { Button, ButtonProps } from "@/core/components/ui/button";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { ListXIcon } from "lucide-react";

export type DataGridClearChangesButtonProps = ButtonProps;

export function DataGridClearChangesButton({
  size = "default",
  variant = "destructive-outline",
  onClick,
  ...props
}: DataGridClearChangesButtonProps) {
  const table = dataGrid.useTableContext();
  const { getChanges, clearChanges } = useDataGrid();

  return (
    <Button
      size={size}
      variant={variant}
      onClick={(e) => {
        onClick?.(e);
        clearChanges();
        table.options.meta?.onEditChange?.(getChanges());
      }}
      {...props}
    >
      <ListXIcon /> Discard
    </Button>
  );
}
