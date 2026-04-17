"use client";

import { formatForDisplay, Hotkey, useHotkeys } from "@tanstack/react-hotkeys";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CornerDownLeftIcon,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Fragment, useCallback, useState, useTransition } from "react";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { useIsMounted } from "../hooks/use-is-mounted";
import { messages } from "../messages";
import { Button, ButtonProps } from "./ui/button";
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from "./ui/command";
import { Kbd, KbdGroup } from "./ui/kbd";
import { LoadingSpinner } from "./ui/spinner";
import { toast } from "./ui/toast";

export type CommandPaletteItem = {
  type?: "nav" | "copy";
  label: string;
  value: string;
  icon?: React.ReactNode;
  shortcut?: Hotkey;
};

export type CommandPaletteGroup = {
  group: string;
  items: CommandPaletteItem[];
};

export type CommandPalleteData =
  | { type: "group"; data: CommandPaletteGroup[] }
  | { type: "list"; data: CommandPaletteItem[] };
// | { type: "group-menu"; data: Menu[] }
// | { type: "list-menu"; data: MenuContent[] };

export type CommandPalleteProps = CommandPalleteData &
  Pick<ButtonProps, "size"> & { shortcuts?: Hotkey[]; placeholder?: string };

export function QuickSearch({
  size = "default",
  type,
  data,
  shortcuts = [],
  placeholder: plch,
}: CommandPalleteProps) {
  const router = useRouter();
  const isMounted = useIsMounted();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTransitioning, startTransition] = useTransition();
  const { copy } = useCopyToClipboard();

  const placeholder = plch ?? "Pencarian cepat";

  const items = type === "group" ? data.flatMap((v) => v.items) : data;
  const itemShortcuts = items
    .map((v) => (v.shortcut ? { ...v, shortcut: v.shortcut } : null))
    .filter((v) => !!v);

  const actionHandler = useCallback(
    (item: CommandPaletteItem) => {
      const type = item.type ?? "nav";

      if (type === "copy") {
        copy(item.value);
        toast.add({ type: "info", title: "Disalin ke clipboard" });
      } else startTransition(() => router.push(item.value));

      setIsOpen(false);
    },
    [copy, router],
  );

  useHotkeys(
    shortcuts.map((k) => ({
      hotkey: k,
      callback: () => setIsOpen((prev) => !prev),
    })),
    { enabled: isMounted },
  );

  useHotkeys(
    itemShortcuts.map((item) => ({
      hotkey: item.shortcut,
      callback: () => actionHandler(item),
    })),
    { enabled: isOpen },
  );

  if (!isMounted)
    return (
      <Button
        size={size}
        variant="outline"
        className="hidden md:inline-flex"
        disabled
      >
        <SearchIcon /> {placeholder}
        <Kbd>{formatForDisplay("Control+K")}</Kbd>
      </Button>
    );

  const Item = ({ data }: { data: CommandPaletteItem }) => (
    <CommandItem
      value={data.value}
      onClick={() => actionHandler(data)}
      className="flex cursor-pointer items-center gap-x-2 **:[svg]:size-4"
    >
      {data.icon} {data.label}
      {data.shortcut && (
        <CommandShortcut>{formatForDisplay(data.shortcut)}</CommandShortcut>
      )}
    </CommandItem>
  );

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandDialogTrigger
        render={
          <Button
            size={size}
            variant="outline"
            className="text-muted-foreground hidden md:inline-flex"
          >
            <LoadingSpinner
              icon={{ base: <SearchIcon /> }}
              loading={isTransitioning}
            />

            {placeholder}

            {shortcuts.length > 0 && (
              <Kbd>{formatForDisplay(shortcuts[0])}</Kbd>
            )}
          </Button>
        }
      />

      <CommandDialogPopup>
        <Command items={data}>
          <CommandInput placeholder={placeholder} />

          <CommandPanel>
            <CommandEmpty>{messages.empty}</CommandEmpty>

            {type === "group" && (
              <CommandList>
                {(group: CommandPaletteGroup) => (
                  <Fragment key={group.group}>
                    <CommandGroup items={group.items}>
                      <CommandGroupLabel>{group.group}</CommandGroupLabel>
                      <CommandCollection>
                        {(item: CommandPaletteItem) => (
                          <Item key={item.value} data={item} />
                        )}
                      </CommandCollection>
                    </CommandGroup>

                    <CommandSeparator />
                  </Fragment>
                )}
              </CommandList>
            )}

            {type === "list" && (
              <CommandList>
                {(item: CommandPaletteItem) => (
                  <Item key={item.value} data={item} />
                )}
              </CommandList>
            )}
          </CommandPanel>

          <CommandFooter>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>
                    <ArrowUpIcon />
                  </Kbd>
                  <Kbd>
                    <ArrowDownIcon />
                  </Kbd>
                </KbdGroup>
                <span>Navigate</span>
              </div>

              <div className="flex items-center gap-2">
                <Kbd>
                  <CornerDownLeftIcon />
                </Kbd>
                <span>Open</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Kbd>Esc</Kbd>
              <span>Close</span>
            </div>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
