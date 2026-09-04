import { useDebounce } from "@/core/hooks/use-debounce";
import { dataTable } from "@/core/modules/table/hooks/data-table";
import { useEffect, useState } from "react";
import { Search, SearchProps } from "../base/search";

export function DataTableSearch(props: SearchProps) {
  const table = dataTable.useTableContext();

  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    const sub = table.atoms.globalFilter.subscribe((v) => {
      if (!v) setValue("");
    });
    return () => sub.unsubscribe();
  }, [table]);

  useEffect(
    () => table.setGlobalFilter(debouncedValue),
    [table, debouncedValue],
  );

  return (
    <Search
      value={value}
      onChange={(e) => setValue(String(e.target.value))}
      {...props}
    />
  );
}
