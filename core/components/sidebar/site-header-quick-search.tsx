"use client";

import { useIsMobile } from "@/core/hooks/use-media-query";
import { getAccessibleMenus } from "@/core/route";
import { stopImpersonateUser } from "@/modules/auth/actions";
import { signOutClient } from "@/modules/auth/components/sign-out-button";
import { useSession } from "@/modules/auth/hooks/use-session";
import { DASHBOARD_FOOTER_MENU, DASHBOARD_MENU } from "@/shared/configs";
import { Layers2Icon, LogOutIcon } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  QuickSearch,
  QuickSearchDataGroup,
  QuickSearchItem,
} from "../quick-search";

export function SiteHeaderQuickSearch() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { user, session } = useSession();

  const data: QuickSearchDataGroup = useMemo(() => {
    const actionItems: QuickSearchItem[] = [
      {
        type: "action",
        label: "Sign out",
        // TODO: variant: "destructive",
        icon: <LogOutIcon />,
        callback: () =>
          signOutClient({ onSuccess: (url) => router.push(url as Route) }),
      },
    ];

    if (session.impersonatedBy)
      actionItems.unshift({
        type: "action",
        label: "Back to my account",
        icon: <Layers2Icon />,
        callback: stopImpersonateUser,
      });

    return [
      ...getAccessibleMenus(DASHBOARD_MENU, user.role),
      { group: "Navigation", items: DASHBOARD_FOOTER_MENU },
      { group: "Actions", items: actionItems },
    ];
  }, [router, user.role, session.impersonatedBy]);

  if (isMobile)
    return (
      <QuickSearch
        type="group"
        data={data}
        className="size-8 justify-center *:not-[svg]:hidden"
      />
    );

  return <QuickSearch type="group" data={data} shortcut={["Control+K"]} />;
}
