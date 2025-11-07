"use client";

import { sidebarMenuButtonVariants } from "@/constants";
import { dashboardfooterMenu } from "@/lib/menu";
import { Role } from "@/lib/permission";
import { routesMeta } from "@/lib/routes";
import { LayoutProvider } from "@/providers/layout";
import { cn, getActiveRoute, getMenuByRole, toKebabCase } from "@/utils";
import { UserWithRole } from "better-auth/plugins";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import {
  ComponentProps,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import { UserAvatar, UserVerifiedBadge } from "../modules/user";
import { SignOutButton } from "../modules/user-client";
import { LinkSpinner, RefreshButton } from "../ui/buttons-client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { getIconOrText } from "../ui/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "../ui/sidebar";
import { Tagline } from "./sections";

type SidebarData = {
  data: Pick<
    UserWithRole,
    "name" | "email" | "image" | "role" | "emailVerified"
  >;
};

export function SidebarApp({
  data,
  children,
}: SidebarData & { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarMain data={data} />

      <SidebarInset>
        <LayoutProvider>{children}</LayoutProvider>
        <footer className="bg-background/90 z-10 mt-auto flex items-center justify-center border-t py-4 text-center md:h-12.5">
          <Tagline className="container" />
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}

function SidebarMain({ data }: SidebarData) {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  const menu = useMemo(() => getMenuByRole(data.role as Role), [data.role]);

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="group/head-button h-13 group-data-[collapsible=icon]:my-2.5 group-data-[collapsible=icon]:p-0"
              asChild
            >
              <Link href={"/dashboard/profile"}>
                <UserAvatar
                  name={data.name}
                  image={data.image}
                  className="rounded-md"
                  classNames={{
                    image: "rounded-md group-hover/head-button:scale-125",
                    fallback: "rounded-md group-hover/head-button:scale-125",
                  }}
                />

                <div className="grid break-all **:line-clamp-1">
                  <div className="flex items-center gap-x-2">
                    <span className="text-sm font-semibold">{data.name}</span>
                    {data.emailVerified && (
                      <UserVerifiedBadge
                        classNames={{ icon: "size-3.5" }}
                        withoutText
                      />
                    )}
                  </div>

                  <span className="text-xs">{data.email}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {menu.map(({ section, content }, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{section}</SidebarGroupLabel>

            <SidebarMenu>
              {content.map(({ route, icon, disabled, subMenu }) => {
                const { displayName } = routesMeta[route];
                const iconElement = getIconOrText(icon);

                const isActive = route === getActiveRoute(pathname);

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
                  <SidebarCollapsible key={route} isActive={isActive} asChild>
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

                          <CollapsibleContent animate>
                            <SidebarMenuSub>
                              {subMenu.map(
                                ({ label, href, className, ...props }, idx) => (
                                  <SidebarMenuSubItem key={idx}>
                                    <SidebarMenuSubButton
                                      className={cn(
                                        "flex justify-between",
                                        className,
                                      )}
                                      asChild
                                      {...props}
                                    >
                                      <Link
                                        href={
                                          href ??
                                          `${route}/#${toKebabCase(label)}`
                                        }
                                      >
                                        <span className="line-clamp-1">
                                          {label}
                                        </span>
                                        <LinkSpinner />
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ),
                              )}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      )}
                    </SidebarMenuItem>
                  </SidebarCollapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Refresh Page" asChild>
              <RefreshButton
                size="sm"
                variant="ghost"
                className={cn(
                  sidebarMenuButtonVariants({ size: "sm" }),
                  "justify-start",
                )}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>

          {dashboardfooterMenu.map(({ url, displayName, icon, disabled }) => {
            const iconElement = getIconOrText(icon);
            return (
              <SidebarMenuItem key={url}>
                {disabled ? (
                  <SidebarMenuButton size="sm" disabled>
                    {iconElement} {displayName}
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton size="sm" tooltip={displayName} asChild>
                    <Link href={url}>
                      <LinkSpinner icon={{ base: iconElement }} />
                      {displayName}
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}

          <SidebarSeparator />

          <SidebarMenuItem>
            <SignOutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function SidebarCollapsible({
  isActive,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Root> & {
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(isActive);

  const onActiveRoute = useEffectEvent(() => setIsOpen(true));

  useEffect(() => {
    if (isActive) onActiveRoute();
  }, [isActive]);

  return <Collapsible open={isOpen} onOpenChange={setIsOpen} {...props} />;
}
