import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { Search, SearchProps } from "../base/search";

export function DataGridSearch(props: SearchProps) {
  const table = dataGrid.useTableContext();
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
