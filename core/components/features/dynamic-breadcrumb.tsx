"use client";

import { useIsMobile } from "@/core/hooks/use-media-query";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "../ui/menu";

type DynamicBreadcrumbContent = { href: Route; label: string };
type DynamicBreadcrumbData = Route | DynamicBreadcrumbContent;
export type DynamicBreadcrumbProps = {
  breadcrumb?: DynamicBreadcrumbData[];
  currentPage?: string;
};

function getProps(data: DynamicBreadcrumbData): DynamicBreadcrumbContent {
  return typeof data === "string"
    ? { href: data, label: route[data].displayName }
    : data;
}

export function DynamicBreadcrumb({
  breadcrumb,
  currentPage,
  className,
}: DynamicBreadcrumbProps & { className?: string }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumb?.map((item, index) => {
          const { href, label } = getProps(item);
          if (isMobile && index !== 0) return;

          return (
            <Fragment key={href}>
              <BreadcrumbItem className="shrink-0">
                <BreadcrumbLink asChild>
                  <Link href={href} className="link">
                    {label}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </Fragment>
          );
        })}

        {breadcrumb && breadcrumb.length > 2 && (
          <>
            <BreadcrumbItem className="mx-0.5 md:hidden">
              <Menu>
                <MenuTrigger asChild>
                  <BreadcrumbEllipsis />
                </MenuTrigger>
                <MenuPopup>
                  {breadcrumb?.map((item, index) => {
                    const { href, label } = getProps(item);
                    if (isMobile && index === 0) return;

                    return (
                      <MenuItem key={href} asChild>
                        <Link href={href}>{label}</Link>
                      </MenuItem>
                    );
                  })}
                </MenuPopup>
              </Menu>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="md:hidden">/</BreadcrumbSeparator>
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage className="line-clamp-1 cursor-default text-ellipsis">
            {currentPage ?? routesConfig[pathname]?.displayName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
