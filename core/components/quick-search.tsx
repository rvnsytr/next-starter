"use client";

import { routesConfig } from "@/shared/route";
import { formatForDisplay, Hotkey, useHotkeys } from "@tanstack/react-hotkeys";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CornerDownLeftIcon,
  DotIcon,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useMemo, useState, useTransition } from "react";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { useIsMounted } from "../hooks/use-is-mounted";
import { messages } from "../messages";
import { Menu, Override } from "../types";
import { cn, toCase } from "../utils";
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

export type QuickSearchItem = {
  type?: "nav" | "copy";
  label: string;
  value: string;
  icon?: React.ReactNode;
  shortcut?: Hotkey;
};

export type QuickSearchGroup = {
  group: string;
  items: QuickSearchItem[];
};

export type QuickSearchData =
  | { type: "group"; data: QuickSearchGroup[] }
  | { type: "list"; data: QuickSearchItem[] }
  | { type: "group-menu"; data: Menu[] };
// | { type: "list-menu"; data: MenuItem[] };

export type QuickSearchProps = QuickSearchData &
  Pick<ButtonProps, "size" | "className"> & {
    shortcuts?: Hotkey[];
    placeholder?: string;
    shortcutsOnlyWhenOpen?: boolean;
  };

export function QuickSearch({
  type,
  data: propData,
  shortcuts = [],
  placeholder = "Pencarian cepat",
  shortcutsOnlyWhenOpen = false,
  size = "default",
  className,
}: QuickSearchProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTransitioning, startTransition] = useTransition();
  const isMounted = useIsMounted();
  const { copy } = useCopyToClipboard();

  const isGroup = type === "group" || type === "group-menu";

  const data: QuickSearchGroup[] | QuickSearchItem[] = useMemo(() => {
    if (!isGroup) return propData;
    return propData.map((v) => {
      const items: QuickSearchItem[] = v.items.flatMap((it) => {
        if ("label" in it) return it;
        const config = routesConfig[it.route];

        const item: QuickSearchItem = {
          label: config.label,
          value: it.route,
          shortcut: it.shortcut,
          icon: it.icon ? <it.icon /> : undefined,
        };

        const subItems: QuickSearchItem[] = (it.subItems ?? []).map((sub) => ({
          label: `${item.label} / ${sub.label}`,
          value: sub.href ?? `${it.route}#${toCase(sub.label, "kebab")}`,
          icon: <DotIcon className="text-muted-foreground" />,
        }));

        return [item, ...subItems];
      });
      return { group: v.group, items };
    });
  }, [isGroup, propData]);

  const itemShortcuts: Override<QuickSearchItem, { shortcut: Hotkey }>[] =
    useMemo(() => {
      const handler = (item: QuickSearchItem) =>
        item.shortcut ? { ...item, shortcut: item.shortcut } : null;
      return data
        .flatMap((v) => {
          return "label" in v ? handler(v) : v.items.map((it) => handler(it));
        })
        .filter((v) => !!v);
    }, [data]);

  const actionHandler = useCallback(
    (item: QuickSearchItem) => {
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
    { enabled: shortcutsOnlyWhenOpen ? isOpen : true },
  );

  if (!isMounted)
    return (
      <Button
        size={size}
        variant="outline"
        className={cn(className, "hidden justify-start md:inline-flex")}
        disabled
      >
        <SearchIcon /> {placeholder}
        {shortcuts.length > 0 && (
          <Kbd className="ml-auto">{formatForDisplay(shortcuts[0])}</Kbd>
        )}
      </Button>
    );

  const Item = ({ item }: { item: QuickSearchItem }) => {
    const splitedLabel = item.label.split("/");
    return (
      <CommandItem
        value={item.value}
        onClick={() => actionHandler(item)}
        className="flex cursor-pointer items-center gap-x-2 **:[svg]:size-4"
      >
        {item.icon}

        {splitedLabel.map((s, i) => {
          const isLast = i + 1 === splitedLabel.length;
          return (
            <Fragment key={i}>
              <span className={cn(!isLast && "text-muted-foreground")}>
                {s.trim()}
              </span>
              {!isLast && <span className="text-muted-foreground">/</span>}
            </Fragment>
          );
        })}

        {item.shortcut && (
          <CommandShortcut>{formatForDisplay(item.shortcut)}</CommandShortcut>
        )}
      </CommandItem>
    );
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandDialogTrigger
        render={
          <Button
            size={size}
            variant="outline"
            className={cn(
              "hidden justify-start transition *:transition md:inline-flex",
              "group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:*:not-[svg]:hidden",
              className,
            )}
          >
            <LoadingSpinner
              icon={{ base: <SearchIcon /> }}
              loading={isTransitioning}
            />

            <span>{placeholder}</span>

            {shortcuts.length > 0 && (
              <Kbd className="ml-auto">{formatForDisplay(shortcuts[0])}</Kbd>
            )}
          </Button>
        }
      />

      <CommandDialogPopup>
        <Command items={data}>
          <CommandInput placeholder={placeholder} />

          <CommandPanel>
            <CommandEmpty>{messages.empty}</CommandEmpty>

            {isGroup ? (
              <CommandList>
                {(group: QuickSearchGroup) => (
                  <Fragment key={group.group}>
                    <CommandGroup items={group.items}>
                      <CommandGroupLabel>{group.group}</CommandGroupLabel>
                      <CommandCollection>
                        {(item: QuickSearchItem) => (
                          <Item key={item.value} item={item} />
                        )}
                      </CommandCollection>
                    </CommandGroup>

                    <CommandSeparator />
                  </Fragment>
                )}
              </CommandList>
            ) : (
              <CommandList>
                {(item: QuickSearchItem) => (
                  <Item key={item.value} item={item} />
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
