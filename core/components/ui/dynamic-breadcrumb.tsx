"use client";

import { routesMeta } from "@/core/constants";
import { useIsMobile } from "@/core/hooks";
import { Route } from "next";
import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

type DynamicBreadcrumbMeta = { href: Route; displayName: string };
type DynamicBreadcrumbData = Route | DynamicBreadcrumbMeta;
export type DynamicBreadcrumbProps = {
  breadcrumb?: DynamicBreadcrumbData[];
  currentPage: string;
};

function getProps(data: DynamicBreadcrumbData): DynamicBreadcrumbMeta {
  return typeof data === "string"
    ? { href: data, displayName: routesMeta[data].displayName }
    : data;
}

export function DynamicBreadcrumb({
  breadcrumb,
  currentPage,
  className,
}: DynamicBreadcrumbProps & { className?: string }) {
  const isMobile = useIsMobile();
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumb?.map((item, index) => {
          const { href, displayName } = getProps(item);
          if (isMobile && index !== 0) return;

          return (
            <Fragment key={href}>
              <BreadcrumbItem className="shrink-0">
                <BreadcrumbLink asChild>
                  <Link href={href} className="link">
                    {displayName}
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {breadcrumb?.map((item, index) => {
                    const { href, displayName } = getProps(item);
                    if (isMobile && index === 0) return;

                    return (
                      <DropdownMenuItem key={href} asChild>
                        <Link href={href}>{displayName}</Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="md:hidden">/</BreadcrumbSeparator>
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage className="line-clamp-1 cursor-default text-ellipsis">
            {currentPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
