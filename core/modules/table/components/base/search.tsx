import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Kbd } from "@/core/components/ui/kbd";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { cn } from "cn";
import { SearchIcon } from "lucide-react";
import { useRef } from "react";

export type SearchProps = React.ComponentProps<typeof InputGroupInput> & {
  /**
   * Keyboard shortcut used to focus the search input.
   * If set to "default", the default shortcut (/) is used.
   *
   * @default "default"
   */
  shortcut?: "default" | Hotkey;
};

const DEFAULT_SHORTCUT: Hotkey = ["/"];

export function Search({
  shortcut,
  placeholder = "Search...",
  className,
  ...props
}: SearchProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  const hotkey = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;
  useHotkey(hotkey ?? DEFAULT_SHORTCUT, () => searchRef.current?.focus(), {
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
