import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/core/components/ui/sidebar";
import { SignOutButton } from "@/modules/auth/components/sign-out-button";
import { dashboardfooterMenu } from "@/shared/menu";
import Link from "next/link";

export function SidebarAppFooter() {
  return (
    <SidebarFooter>
      <SidebarMenu className="gap-2">
        {dashboardfooterMenu.map(({ route, label, icon: Icon, disabled }) => {
          const iconElement = Icon && <Icon />;
          return (
            <SidebarMenuItem key={route}>
              {disabled ? (
                <SidebarMenuButton size="sm" disabled>
                  {iconElement} {label}
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  size="sm"
                  tooltip={label}
                  render={
                    <Link href={route}>
                      {iconElement} {label}
                    </Link>
                  }
                />
              )}
            </SidebarMenuItem>
          );
        })}

        <SidebarSeparator />

        {/* <StopImpersonateUserMenuItem /> */}

        <SidebarMenuItem>
          <SignOutButton />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
