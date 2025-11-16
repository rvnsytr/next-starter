"use client";

import { cn } from "@/core/utils";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  animate = false,
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> & {
  animate?: boolean;
}) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn(
        animate &&
          "data-[state=open]:animate-fade data-[state=open]:animate-duration-250",
        className,
      )}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
