import { dataTable } from "@/core/modules/table/hooks/data-table";
import { Search, SearchProps } from "../base/search";

export function DataTableSearch(props: SearchProps) {
  const table = dataTable.useTableContext();
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
