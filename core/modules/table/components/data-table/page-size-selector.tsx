import { dataTable } from "@/core/modules/table/hooks/data-table";
import {
  PageSizeSelector,
  PageSizeSelectorProps,
} from "../base/page-size-selector";

export function DataTablePageSizeSelector(props: PageSizeSelectorProps) {
  const table = dataTable.useTableContext();
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
