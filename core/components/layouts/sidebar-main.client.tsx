"use client";

import { routesMeta } from "@/core/constants";
import { getActiveRoute, getMenuByRole, toKebabCase } from "@/core/utils";
import { Role, useAuth, UserAvatar, UserVerifiedBadge } from "@/modules/auth";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "../ui/sidebar";
import { LinkSpinner } from "../ui/spinner";

export function SidebarAppHeader() {
  const { user } = useAuth();

  return (
    <SidebarMenuButton
      size="lg"
      className="group/head-button h-13 group-data-[collapsible=icon]:my-2.5 group-data-[collapsible=icon]:p-0"
      asChild
    >
      <Link href="/dashboard/profile">
        <UserAvatar
          name={user.name}
          image={user.image}
          className="rounded-md"
          classNames={{
            image: "rounded-md group-hover/head-button:scale-105",
            fallback: "rounded-md group-hover/head-button:scale-105",
          }}
        />

        <div className="grid break-all">
          <div className="flex items-center gap-x-2">
            <span className="line-clamp-1 text-sm font-semibold">
              {user.name}
            </span>
            {user.emailVerified && (
              <UserVerifiedBadge
                classNames={{ icon: "size-3.5" }}
                withoutText
              />
            )}
          </div>

          <span className="line-clamp-1 text-xs">{user.email}</span>
        </div>
      </Link>
    </SidebarMenuButton>
  );
}

export function SidebarAppContent() {
  const { user } = useAuth();

  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  const menu = useMemo(() => getMenuByRole(user.role as Role), [user.role]);

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
                <Collapsible key={route} asChild>
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

                    {subMenu && (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                          </SidebarMenuAction>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {subMenu.map(({ label, href, variant }, idx) => (
                              <SidebarMenuSubItem key={idx}>
                                <SidebarMenuSubButton
                                  variant={variant}
                                  className="flex justify-between"
                                  asChild
                                >
                                  <Link
                                    href={
                                      href ?? `${route}/#${toKebabCase(label)}`
                                    }
                                  >
                                    <span className="line-clamp-1">
                                      {label}
                                    </span>
                                    <LinkSpinner />
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}
