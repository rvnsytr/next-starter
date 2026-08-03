"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Kbd } from "@/core/components/ui/kbd";
import { cn } from "@/core/utils";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { SearchIcon } from "lucide-react";
import { useRef } from "react";
import { coreTable } from "../hooks/core-table";

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
  Required<
    Pick<React.ComponentProps<typeof InputGroupInput>, "value" | "onChange">
  >) {
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

export function CoreTableSearch(props: SearchProps) {
  const table = coreTable.useTableContext();
  return (
    <Search
      value={table.atoms.globalFilter.get() ?? ""}
      onChange={(e) => table.setGlobalFilter(String(e.target.value))}
      {...props}
    />
  );
}
