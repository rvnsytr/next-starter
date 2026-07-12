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
> & {
  table: Table<TData>;
  /** @default "/" */
  shortcut?: Hotkey | "default";
}) {
  const searchRef = useRef<HTMLInputElement>(null);

  const hotkey = shortcut === "default" ? "/" : shortcut;

  useHotkeys(
    hotkey ? [{ hotkey, callback: () => searchRef.current?.focus() }] : [],
    { enabled: !!hotkey },
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

      {hotkey && (
        <InputGroupAddon align="inline-end" className="hidden lg:inline-flex">
          <Kbd>{formatForDisplay(hotkey)}</Kbd>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
