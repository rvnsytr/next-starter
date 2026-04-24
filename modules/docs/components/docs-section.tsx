import { Badge } from "@/core/components/ui/badge";
import { Label } from "@/core/components/ui/label";
import { cn, toCase } from "@/core/utils";
import { ArrowUpRightIcon, AtomIcon, HashIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { DocProps, docsFromConfig } from "../config";

export function DocsSection({
  fill = false,
  withIcon = false,
  className,
  containerClassName,
  children,
}: {
  fill?: boolean;
  withIcon?: boolean;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex w-full justify-center not-last:border-b",
        fill && "flex-1",
        containerClassName,
      )}
    >
      <div
        className={cn("relative w-full md:max-w-5xl md:border-x", className)}
      >
        {children}

        {withIcon && (
          <>
            <PlusIcon className="text-muted-foreground absolute -right-2 -bottom-2 hidden size-4 md:flex" />
            <PlusIcon className="text-muted-foreground absolute -bottom-2 -left-2 hidden size-4 md:flex" />
          </>
        )}
      </div>
    </section>
  );
}

export function DocsContentWrapper({
  id,
  data,
  className,
  children,
}: {
  id: string;
  data: DocProps["content"][number];
  className?: string;
  children?: React.ReactNode;
}) {
  const refs = (data.refs ?? [])
    .map((r) => {
      if (!data.label) return null;
      if (typeof r !== "string") {
        const { type, ...rest } = r;
        return { type: type ?? "internal", ...rest };
      }

      const { label, baseUrl } = docsFromConfig[r];
      const url = `${baseUrl}/${toCase(data.label, "kebab")}`;
      return { type: "meta" as const, url, label };
    })
    .filter((v) => !!v);

  return (
    <div
      id={id}
      className={cn("flex scroll-m-12 flex-col gap-4 border-t p-4", className)}
    >
      {data.label && (
        <div className="relative flex w-full justify-between gap-2">
          <Label className="flex items-center gap-x-2">
            <HashIcon className="text-muted-foreground size-3.5" />
            {data.label}
          </Label>

          {refs.length > 0 && (
            <div className="flex flex-row-reverse items-center gap-x-1">
              {refs.map((r) => {
                const Icon =
                  r.type === "internal" ? AtomIcon : ArrowUpRightIcon;
                return (
                  <Badge
                    key={r.url}
                    variant={
                      r.type === "meta"
                        ? "outline"
                        : r.type === "internal"
                          ? "outline"
                          : "info"
                    }
                    className={cn(
                      r.type !== "meta" && !r.label && "aspect-square",
                    )}
                    render={
                      <Link
                        href={r.url}
                        target={r.type !== "internal" ? "_blank" : undefined}
                      >
                        {r.type === "meta" ? (
                          r.label
                        ) : (
                          <>
                            <Icon className="shrink-0" />
                            <span className={cn(!r.label && "sr-only")}>
                              {r.label ?? "References"}
                            </span>
                          </>
                        )}
                      </Link>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
