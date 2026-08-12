import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import {
  PageSizeSelector,
  PageSizeSelectorProps,
} from "../base/page-size-selector";

export function DataGridPageSizeSelector(props: PageSizeSelectorProps) {
  const table = dataGrid.useTableContext();
  return (
    <table.Subscribe selector={(s) => s.pagination.pageSize}>
      {(pageSize) => (
        <PageSizeSelector
          context={{
            defaultPageSize: table.options.initialState?.pagination?.pageSize,
            pageSize,
            onPageSizeChange: (ps) => table.setPageSize(ps),
          }}
          {...props}
        />
      )}
    </table.Subscribe>
  );
}
