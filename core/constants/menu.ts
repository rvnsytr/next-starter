import { LucideIcon } from "lucide-react";
import { Route } from "next";
import { LinkProps } from "next/link";
import { RouteRole } from "../route";

export type Menu = { section: string; content: MenuContent[] };

export type MenuContent = {
  route: Route;
  icon?: LucideIcon;
  disabled?: boolean;

  // if href is not defined, the Link href prop will be `/{route}/#${toCase(label, "kebab")}`
  subMenu?: {
    label: string;
    href?: LinkProps["href"];
    variant?: "default" | "destructive";
    disabled?: boolean;
    role?: RouteRole;
  }[];
};
