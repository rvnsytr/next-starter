import { useDebounce } from "@/core/hooks/use-debounce";
import { dataGrid } from "@/core/modules/table/hooks/data-grid";
import { useEffect, useState } from "react";
import { Search, SearchProps } from "../base/search";

export function DataGridSearch(props: SearchProps) {
  const table = dataGrid.useTableContext();

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
