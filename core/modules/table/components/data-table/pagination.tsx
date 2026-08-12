import { dataTable } from "@/core/modules/table/hooks/data-table";
import { Pagination, PaginationProps } from "../base/pagination";

export function DataTablePagination(props: PaginationProps) {
  const table = dataTable.useTableContext();
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
