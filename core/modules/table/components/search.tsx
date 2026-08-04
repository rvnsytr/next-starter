"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Kbd } from "@/core/components/ui/kbd";
import { useDebounce } from "@/core/hooks/use-debounce";
import { cn } from "@/core/utils";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { dataTable } from "../hooks/data-table";

export type SearchProps = Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "ref" | "value" | "onChange"
> & {
  /** @default "/" */
  shortcut?: Hotkey | "default";
};

export const SEARCH_DEFAULT_HOTKEY: Hotkey = "/";

export function Search({
  shortcut,
  placeholder = "Cari...",
  className,
  ...props
}: SearchProps &
  Pick<React.ComponentProps<typeof InputGroupInput>, "value" | "onChange">) {
  const searchRef = useRef<HTMLInputElement>(null);

  const hotkey = shortcut === "default" ? SEARCH_DEFAULT_HOTKEY : shortcut;

  useHotkey(hotkey ?? SEARCH_DEFAULT_HOTKEY, () => searchRef.current?.focus(), {
    enabled: !!hotkey,
  });

  return (
    <InputGroup className={cn(className)}>
      <InputGroupInput ref={searchRef} placeholder={placeholder} {...props} />

      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>

      {hotkey && (
        <InputGroupAddon align="inline-end">
          <Kbd>{formatForDisplay(hotkey)}</Kbd>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

export function DataTableSearch(props: SearchProps) {
  const table = dataTable.useTableContext();
  const defaultValue = table.atoms.globalFilter.get() ?? "";

  const [value, setValue] = useState<string>(defaultValue);
  const debouncedSearch = useDebounce(value);

  useEffect(() => table.setGlobalFilter(value), [debouncedSearch]);

  return (
    <Search
      value={value}
      onChange={(e) => setValue(String(e.target.value))}
      {...props}
    />
  );
}
