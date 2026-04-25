"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { Table } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { useRef } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Kbd } from "./ui/kbd";

export function DataControllerSearch<TData>({
  table,
  placeholder = "Cari...",
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "ref" | "value" | "onChange" | "className"
> & { table: Table<TData>; className?: string }) {
  const searchRef = useRef<HTMLInputElement>(null);
  useHotkey("/", () => searchRef.current?.focus());

  return (
    <InputGroup className={className}>
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

      <InputGroupAddon align="inline-end">
        {/* <Kbd>⌘</Kbd> */}
        <Kbd>/</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}
