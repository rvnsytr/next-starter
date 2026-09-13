import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Kbd } from "@/core/components/ui/kbd";
import {
  formatForDisplay,
  HotkeySequence,
  useHotkeySequence,
} from "@tanstack/react-hotkeys";
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
  shortcut?: "default" | HotkeySequence;
};

const DEFAULT_SHORTCUT: HotkeySequence = ["/"];

export function Search({
  shortcut,
  placeholder = "Cari...",
  className,
  ...props
}: SearchProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  const hotkeySequence = shortcut === "default" ? DEFAULT_SHORTCUT : shortcut;
  useHotkeySequence(
    hotkeySequence ?? DEFAULT_SHORTCUT,
    () => searchRef.current?.focus(),
    { enabled: !!hotkeySequence },
  );

  return (
    <InputGroup className={cn(className)}>
      <InputGroupInput ref={searchRef} placeholder={placeholder} {...props} />

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
