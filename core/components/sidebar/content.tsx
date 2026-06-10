"use client";

import { getActiveRoute, getMenuByRole } from "@/core/route";
import { MenuItem } from "@/core/types";
import { toCase } from "@/core/utils";
import { useSession } from "@/modules/auth/hooks/use-session";
import { routeConfig } from "@/shared/config";
import { menuConfig } from "@/shared/menu";
import { ChevronRightIcon } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, useEffect, useMemo, useState } from "react";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "../../../../react-starter/src/core/components/ui/collapsible";
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
} from "../../../../react-starter/src/core/components/ui/sidebar";
import { LinkSpinner } from "../../../../react-starter/src/core/components/ui/spinner";

export function SidebarAppContent() {
  const { user } = useSession();
  const pathname = usePathname();

  const menu = useMemo(
    () => getMenuByRole(menuConfig.dashboard, user.role),
    [user.role],
  );

  const activeRoute = getActiveRoute(menu, pathname);

  return (
    <SidebarContent>
      {menu.map(({ group, items }, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{group}</SidebarGroupLabel>

          <SidebarMenu>
            {items.map((item) => (
              <SidebarAppContentCollapsible
                key={item.route}
                data={item}
                activeRoute={activeRoute}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}

function SidebarAppContentCollapsible({
  data,
  activeRoute,
  ...props
}: ComponentProps<typeof Collapsible> & {
  data: MenuItem;
  activeRoute?: Route;
}) {
  const hasSubItems = !!data.subItems?.length;
  const isActive = data.route === activeRoute;

  const { isMobile, toggleSidebar } = useSidebar();
  const { title } = routeConfig[data.route];

  const iconElement = data.icon && <data.icon />;

  const [open, setOpen] = useState(isActive);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isActive) setOpen(true);
  }, [isActive]);

  if (data.disabled) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton disabled>
          {iconElement}
          <span className="line-clamp-1">{title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible
      open={hasSubItems ? open : false}
      onOpenChange={setOpen}
      render={<SidebarMenuItem />}
      {...props}
    >
      <SidebarMenuButton
        onClick={() => {
          if (isMobile) toggleSidebar();
        }}
        isActive={isActive}
        tooltip={title}
        render={<Link href={data.route} />}
      >
        <LinkSpinner icon={{ base: iconElement }} />
        <span className="line-clamp-1">{title}</span>
      </SidebarMenuButton>

      {data.subItems && (
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
              {data.subItems.map((itm, idx) => {
                const subHref = `${data.route}#${toCase(itm.label, "kebab")}`;
                return (
                  <SidebarMenuSubItem key={idx}>
                    <SidebarMenuSubButton
                      className="flex justify-between"
                      render={
                        <Link href={itm.href ?? subHref}>
                          <span className="line-clamp-1">{itm.label}</span>
                          <LinkSpinner />
                        </Link>
                      }
                    />
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsiblePanel>
        </>
      )}
    </Collapsible>
  );
}
