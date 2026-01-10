"use client";

import { routesMeta } from "@/core/constants";
import { useIsMounted } from "@/core/hooks";
import { getActiveRoute, getMenuByRole, toKebab } from "@/core/utils";
import { useAuth, UserAvatar, UserVerifiedBadge } from "@/modules/auth";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ComponentProps,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { CommandPalette } from "../ui/command-palette";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "../ui/sidebar";
import { LinkSpinner } from "../ui/spinner";

export function SidebarMainHeader() {
  const { user } = useAuth();
  const menu = useMemo(() => getMenuByRole(user.role), [user.role]);
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="group/head-button h-13 group-data-[collapsible=icon]:my-2.5 group-data-[collapsible=icon]:p-0"
            asChild
          >
            <Link href="/dashboard/profile">
              <UserAvatar
                data={user}
                className="rounded-md"
                classNames={{
                  image: "rounded-md group-hover/head-button:scale-105",
                  fallback: "rounded-md group-hover/head-button:scale-105",
                }}
              />

              <div className="grid break-all">
                <div className="flex gap-x-2">
                  <span className="line-clamp-1 text-sm font-semibold">
                    {user.name}
                  </span>
                  {user.emailVerified && (
                    <UserVerifiedBadge
                      classNames={{ icon: "size-3.5" }}
                      noText
                    />
                  )}
                </div>

                <span className="line-clamp-1 text-xs">{user.email}</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarSeparator className="mb-2" />

      <CommandPalette data={menu} />
    </SidebarHeader>
  );
}

export function SidebarMainContent() {
  const { user } = useAuth();
  const { isMobile, toggleSidebar } = useSidebar();

  const pathname = usePathname();
  const isMounted = useIsMounted();

  const menu = useMemo(() => getMenuByRole(user.role), [user.role]);

  return (
    <SidebarContent>
      {menu.map(({ section, content }, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{section}</SidebarGroupLabel>

          <SidebarMenu>
            {content.map(({ route, icon: Icon, disabled, subMenu }) => {
              const { displayName } = routesMeta[route];

              const isActive = route === getActiveRoute(pathname);
              const iconElement = Icon && <Icon />;

              if (disabled) {
                return (
                  <SidebarMenuItem key={route}>
                    <SidebarMenuButton disabled>
                      {iconElement}
                      <span className="line-clamp-1">{displayName}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              return (
                <SidebarMainContentCollapsible
                  key={route}
                  isActive={isActive}
                  asChild
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => isMobile && toggleSidebar()}
                      isActive={isActive}
                      tooltip={displayName}
                      asChild
                    >
                      <Link href={route}>
                        <LinkSpinner icon={{ base: iconElement }} />
                        <span className="line-clamp-1">{displayName}</span>
                      </Link>
                    </SidebarMenuButton>

                    {subMenu &&
                      (isMounted ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                              <ChevronRightIcon />
                            </SidebarMenuAction>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {subMenu.map((itm, idx) => (
                                <SidebarMenuSubItem key={idx}>
                                  <SidebarMenuSubButton
                                    variant={itm.variant}
                                    className="flex justify-between"
                                    disabled={itm.disabled}
                                    asChild
                                  >
                                    <Link
                                      href={
                                        itm.href ??
                                        `${route}/#${toKebab(itm.displayName)}`
                                      }
                                    >
                                      <span className="line-clamp-1">
                                        {itm.displayName}
                                      </span>
                                      <LinkSpinner />
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : (
                        <SidebarMenuAction disabled>
                          <ChevronRightIcon />
                        </SidebarMenuAction>
                      ))}
                  </SidebarMenuItem>
                </SidebarMainContentCollapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}

function SidebarMainContentCollapsible({
  isActive,
  ...props
}: ComponentProps<typeof Collapsible> & { isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(isActive);

  const onActiveRoute = useEffectEvent(() => {
    if (isActive && !isOpen) setIsOpen(true);
  });

  useEffect(() => onActiveRoute, [isActive]);

  return <Collapsible open={isOpen} onOpenChange={setIsOpen} {...props} />;
}
