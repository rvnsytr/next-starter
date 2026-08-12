import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Kbd } from "@/core/components/ui/kbd";
import { useDebounce } from "@/core/hooks/use-debounce";
import { cn } from "@/core/utils";
import {
  formatForDisplay,
  HotkeySequence,
  useHotkeySequence,
} from "@tanstack/react-hotkeys";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type SearchProps = Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "ref" | "value" | "onChange"
> & {
  /**
   * Keyboard shortcut used to focus the search input.
   * If set to "default", the default shortcut (/) is used.
   *
   * @default "default"
   */
  shortcut?: "default" | HotkeySequence;
};

type SearchContext = {
  defaultValue: string;
  onSearch: (value: string) => void;
};

const DEFAULT_SHORTCUT: HotkeySequence = ["/"];

export function Search({
  context,
  shortcut,
  placeholder = "Cari...",
  className,
  ...props
}: SearchProps & { context: SearchContext }) {
  const searchRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState<string>(context.defaultValue);
  const debouncedSearch = useDebounce(value);

  const hotkeySequence = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;

  useHotkeySequence(
    hotkeySequence ?? DEFAULT_SHORTCUT,
    () => searchRef.current?.focus(),
    { enabled: !!hotkeySequence },
  );

  useEffect(
    () => context.onSearch(debouncedSearch),
    [debouncedSearch, context],
  );

  return (
    <InputGroup className={cn(className)}>
      <InputGroupInput
        ref={searchRef}
        value={value}
        onChange={(e) => setValue(String(e.target.value))}
        placeholder={placeholder}
        {...props}
      />

      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>

      {hotkeySequence && (
        <InputGroupAddon align="inline-end">
          <Kbd>{hotkeySequence.map((k) => formatForDisplay(k)).join("+")}</Kbd>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
