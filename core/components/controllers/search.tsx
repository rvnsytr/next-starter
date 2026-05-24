"use client";

import { cn } from "@/core/utils";
import { formatForDisplay, Hotkey, useHotkeys } from "@tanstack/react-hotkeys";
import { Table } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { useRef } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Kbd } from "../ui/kbd";

export function Search<TData>({
  table,
  placeholder = "Cari...",
  className,
  shortcut,
  ...props
}: Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "ref" | "value" | "onChange"
> & { table: Table<TData>; shortcut?: Hotkey }) {
  const searchRef = useRef<HTMLInputElement>(null);

  useHotkeys(
    shortcut
      ? [{ hotkey: shortcut, callback: () => searchRef.current?.focus() }]
      : [],
    { enabled: !!shortcut },
  );

  return (
    <InputGroup className={cn(className)}>
      <InputGroupInput
        ref={searchRef}
        placeholder={placeholder}
        value={table.getState().globalFilter}
        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
        {...props}
      />

      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>

      {shortcut && (
        <InputGroupAddon align="inline-end" className="hidden lg:inline-flex">
          <Kbd>{formatForDisplay(shortcut)}</Kbd>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
