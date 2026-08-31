import { dataController } from "@/core/modules/table/hooks/data-controller";
import {
  PageSizeSelector,
  PageSizeSelectorProps,
} from "../base/page-size-selector";

export function DataControllerPageSizeSelector(props: PageSizeSelectorProps) {
  const table = dataController.useTableContext();
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
