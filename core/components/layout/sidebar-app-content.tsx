"use client";

import { useIsMounted } from "@/core/hooks/use-is-mounted";
import { getActiveRoute, getMenuByRole } from "@/core/route";
import { toCase } from "@/core/utils";
import { useAuth } from "@/modules/auth/provider";
import { menuConfig } from "@/shared/menu";
import { routesConfig } from "@/shared/route";
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
  CollapsiblePanel,
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

export function SidebarAppContent() {
  const { user } = useAuth();
  const { isMobile, toggleSidebar } = useSidebar();

  const pathname = usePathname();
  const isMounted = useIsMounted();

  const menu = useMemo(
    () => getMenuByRole(menuConfig.dashboard, user.role),
    [user.role],
  );

  const activeRoute = getActiveRoute(menu, pathname);

  return (
    <SidebarContent>
      {menu.map(({ section, content }, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{section}</SidebarGroupLabel>

          <SidebarMenu>
            {content.map(({ route, icon: Icon, disabled, subMenu }) => {
              const { label } = routesConfig[route];

              const isActive = route === activeRoute;
              const iconElement = Icon && <Icon />;

              if (disabled) {
                return (
                  <SidebarMenuItem key={route}>
                    <SidebarMenuButton disabled>
                      {iconElement}
                      <span className="line-clamp-1">{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              return (
                <SidebarMainContentCollapsible
                  key={route}
                  isActive={isActive}
                  render={<SidebarMenuItem />}
                >
                  <SidebarMenuButton
                    onClick={() => isMobile && toggleSidebar()}
                    isActive={isActive}
                    tooltip={label}
                    render={<Link href={route} />}
                  >
                    <LinkSpinner icon={{ base: iconElement }} />
                    <span className="line-clamp-1">{label}</span>
                  </SidebarMenuButton>

                  {subMenu &&
                    (isMounted ? (
                      <>
                        <CollapsibleTrigger
                          render={
                            <SidebarMenuAction className="data-panel-open:rotate-90">
                              <ChevronRightIcon />
                            </SidebarMenuAction>
                          }
                        />

                        <CollapsiblePanel>
                          <SidebarMenuSub>
                            {subMenu.map((itm, idx) => (
                              <SidebarMenuSubItem key={idx}>
                                <SidebarMenuSubButton
                                  className="flex justify-between"
                                  render={
                                    <Link
                                      href={
                                        itm.href ??
                                        `${route}/#${toCase(itm.label, "kebab")}`
                                      }
                                    >
                                      <span className="line-clamp-1">
                                        {itm.label}
                                      </span>
                                      <LinkSpinner />
                                    </Link>
                                  }
                                />
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsiblePanel>
                      </>
                    ) : (
                      <SidebarMenuAction disabled>
                        <ChevronRightIcon />
                      </SidebarMenuAction>
                    ))}
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
