"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/core/components/ui/command";
import { Menu, messages, routesMeta } from "@/core/constants";
import { cn, toKebab } from "@/core/utils";
import { Dot, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Fragment,
  useEffect,
  useEffectEvent,
  useState,
  useTransition,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Kbd, KbdGroup } from "./kbd";
import { LoadingSpinner } from "./spinner";

type CommandPalleteProps = {
  data: Menu[];
  className?: string;
  placeholder?: string;
};

export function CommandPalette({
  data,
  className,
  placeholder: plch,
}: CommandPalleteProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const placeholder = plch ?? "Pencarian cepat...";
  const onShortcut = useEffectEvent(() => setIsOpen((prev) => !prev));

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onShortcut();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <InputGroup className="group-data-[collapsible=icon]:size-8">
          <InputGroupInput
            placeholder={placeholder}
            className={cn("disabled:opacity-100", className)}
            disabled
          />

          <InputGroupAddon
            align="inline-start"
            className="group-data-[collapsible=icon]:px-1.5"
          >
            <LoadingSpinner loading={isPending} icon={{ base: <Search /> }} />
          </InputGroupAddon>

          <InputGroupAddon
            align="inline-end"
            className="group-data-[collapsible=icon]:hidden"
          >
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </InputGroupAddon>
        </InputGroup>
      </DialogTrigger>

      <DialogContent className="p-1" hideCloseButton>
        <DialogHeader className="sr-only">
          <DialogTitle>Command Pallete</DialogTitle>
          <DialogDescription>Command Menu Pallete</DialogDescription>
        </DialogHeader>

        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{messages.empty}</CommandEmpty>

            {data.map((item, index) => (
              <Fragment key={item.section}>
                {index !== 0 && <CommandSeparator />}

                <CommandGroup heading={item.section}>
                  {item.content.map(
                    ({ route, icon: Icon, disabled, subMenu }) => {
                      const meta = routesMeta[route];
                      const onSelectHandler = (href: string) => {
                        startTransition(() => router.push(href));
                        setIsOpen(false);
                      };

                      return (
                        <Fragment key={route}>
                          <CommandItem
                            disabled={disabled}
                            onSelect={() => onSelectHandler(route)}
                          >
                            {Icon && <Icon />} {meta.displayName}
                          </CommandItem>

                          {!disabled &&
                            subMenu?.map((itm) => {
                              const isDestructive =
                                itm.variant === "destructive";
                              const href = `${route}/#${toKebab(itm.displayName)}`;
                              return (
                                <CommandItem
                                  key={href}
                                  disabled={itm.disabled}
                                  onSelect={() => onSelectHandler(href)}
                                  className={cn(
                                    isDestructive &&
                                      "text-destructive data-[selected=true]:bg-destructive/10 data-[selected=true]:text-destructive",
                                  )}
                                >
                                  <Dot
                                    className={cn(
                                      isDestructive && "text-destructive",
                                    )}
                                  />
                                  {itm.displayName}
                                </CommandItem>
                              );
                            })}
                        </Fragment>
                      );
                    },
                  )}
                </CommandGroup>
              </Fragment>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
