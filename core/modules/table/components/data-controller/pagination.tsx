import { dataController } from "@/core/modules/table/hooks/data-controller";
import { Pagination, PaginationProps } from "../base/pagination";

export function DataControllerPagination(props: PaginationProps) {
  const table = dataController.useTableContext();
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
