import { dataController } from "@/core/modules/table/hooks/data-controller";
import { Search, SearchProps } from "../base/search";

export function DataControllerSearch(props: SearchProps) {
  const table = dataController.useTableContext();
  const defaultValue = table.baseAtoms.globalFilter.get() ?? "";
  return (
    <Search
      context={{
        defaultValue,
        onSearch: (value) => table.setGlobalFilter(value),
      }}
      {...props}
    />
  );
}
