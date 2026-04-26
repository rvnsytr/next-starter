"use client";

import { cn } from "@/core/utils";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";

export function Avatar({
  size = "default",
  radius = "full",
  className,
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg" | "xl";
  radius?: "full" | "lg" | "md";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      data-radius={radius}
      className={cn(
        "group/avatar after:border-border relative flex size-8 shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 data-[size=xl]:size-12 dark:after:mix-blend-lighten",
        radius === "full" && "rounded-full after:rounded-full",
        radius === "lg" && "rounded-lg after:rounded-lg",
        radius === "md" && "rounded-md after:rounded-md",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  ...props
}: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full object-cover",
        "group-data-[radius=full]/avatar:rounded-full",
        "group-data-[radius=lg]/avatar:rounded-lg",
        "group-data-[radius=md]/avatar:rounded-md",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted text-muted-foreground flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs",
        "group-data-[radius=full]/avatar:rounded-full",
        "group-data-[radius=lg]/avatar:rounded-lg",
        "group-data-[radius=md]/avatar:rounded-md",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarBadge({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:*:[svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:*:[svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:*:[svg]:size-2",
        "group-data-[size=xl]/avatar:size-4 group-data-[size=xl]/avatar:*:[svg]:size-2.5",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group *:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=xl]/avatar-group:size-12 *:[svg]:size-4 group-has-data-[size=lg]/avatar-group:*:[svg]:size-5 group-has-data-[size=sm]/avatar-group:*:[svg]:size-3 group-has-data-[size=xl]/avatar-group:*:[svg]:size-6",
        "group-has-data-[radius=full]/avatar-group:rounded-full",
        "group-has-data-[radius=lg]/avatar-group:rounded-lg",
        "group-has-data-[radius=md]/avatar-group:rounded-md",
        className,
      )}
      {...props}
    />
  );
}
