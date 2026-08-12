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

export type SearchProps = Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "ref" | "value" | "onChange"
> & {
  /** @default "/" */
  shortcut?: Hotkey | "default";
};

type SearchContext = {
  defaultValue: string;
  onSearch: (value: string) => void;
};

export const SEARCH_DEFAULT_HOTKEY: Hotkey = "/";

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

  const hotkey = shortcut === "default" ? SEARCH_DEFAULT_HOTKEY : shortcut;
  useHotkey(hotkey ?? SEARCH_DEFAULT_HOTKEY, () => searchRef.current?.focus(), {
    enabled: !!hotkey,
  });

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

      {hotkey && (
        <InputGroupAddon align="inline-end">
          <Kbd>{formatForDisplay(hotkey)}</Kbd>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
