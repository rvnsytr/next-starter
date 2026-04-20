import Link from "next/link";
import { Fragment } from "react";
import { useDynamicBreadcrumb } from "../providers/dynamic-breadcrumb";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Button } from "./ui/button";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "./ui/menu";
import { Skeleton } from "./ui/skeleton";

// type DynamicBreadcrumbContent = { href: Route; label: string };
// type DynamicBreadcrumbData = Route | DynamicBreadcrumbContent;

export function DynamicBreadcrumb({ className }: { className?: string }) {
  const { breadcrumbs } = useDynamicBreadcrumb();

  if (!breadcrumbs.length) return <Skeleton className="h-4 w-48" />;

  const isCompact = breadcrumbs.length > 3;
  const lastPart = breadcrumbs[breadcrumbs.length - 1];

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>

        {breadcrumbs.length > 1 &&
          breadcrumbs.map((br, i) => {
            if (
              (isCompact && i > 0) ||
              (!isCompact && (i > 1 || i === breadcrumbs.length - 1))
            )
              return;

            return (
              <Fragment key={br.href}>
                <BreadcrumbItem className="shrink-0">
                  <BreadcrumbLink
                    render={
                      <Link href={br.href} className="link">
                        {br.label}
                      </Link>
                    }
                  />
                </BreadcrumbItem>

                <BreadcrumbSeparator>/</BreadcrumbSeparator>
              </Fragment>
            );
          })}

        {isCompact && (
          <>
            <BreadcrumbItem>
              <Menu>
                <MenuTrigger
                  render={
                    <Button size="icon-xs" variant="ghost">
                      <BreadcrumbEllipsis />
                    </Button>
                  }
                />

                <MenuPopup>
                  {breadcrumbs.map((br, i) => {
                    if ([0, breadcrumbs.length - 1].includes(i)) return;
                    return (
                      <MenuItem
                        key={br.href}
                        className="h-7"
                        render={<Link href={br.href}>{br.label}</Link>}
                      />
                    );
                  })}
                </MenuPopup>
              </Menu>
            </BreadcrumbItem>

            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage className="line-clamp-1">
            {lastPart.label}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
