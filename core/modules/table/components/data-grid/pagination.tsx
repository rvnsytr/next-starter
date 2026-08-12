import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { Pagination, PaginationProps } from "../base/pagination";

export function DataGridPagination(props: PaginationProps) {
  const table = dataGrid.useTableContext();
  return (
    <Pagination
      context={{
        firstPageControl: {
          onClick: () => table.firstPage(),
          disabled: !table.getCanPreviousPage(),
        },
        previousPageControl: {
          onClick: () => table.previousPage(),
          disabled: !table.getCanPreviousPage(),
        },
        nextPageControl: {
          onClick: () => table.nextPage(),
          disabled: !table.getCanNextPage(),
        },
        lastPageControl: {
          onClick: () => table.lastPage(),
          disabled: !table.getCanNextPage(),
        },
      }}
      {...props}
    />
  );
}
