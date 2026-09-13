import { Button } from "@/core/components/ui/button";
import { ButtonGroup } from "@/core/components/ui/button-group";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { ColumnFilterResult } from "@/core/modules/table/types";
import { cn } from "cn";
import { XIcon } from "lucide-react";
import { FilterOperatorSelector } from "./filter-operator-selector";
import { FilterValueController } from "./filter-value-controller";
import { FilterValueDisplayPopup } from "./filter-value-display";

export type ActiveFiltersContainerProps = React.ComponentProps<"div">;

export function ActiveFiltersContainer({
  className,
  ...props
}: ActiveFiltersContainerProps) {
  return (
    <ScrollArea
      className="border-t border-b border-dashed"
      scrollFade
      withScrollbar={false}
    >
      <div
        className={cn("flex items-center gap-2 px-4 py-2", className)}
        {...props}
      />
    </ScrollArea>
  );
}

export type ActiveFiltersProps = React.ComponentProps<typeof ButtonGroup>;

export function ActiveFilters({
  columns,
  className,
  ...props
}: ActiveFiltersProps & { columns: ColumnFilterResult[] }) {
  return columns.map((c) => {
    if (!c.success) {
      let errorContent = "";

      if (c.type === "column")
        errorContent = c.message ?? `Invalid Column Id: ${c.id}`;
      if (c.type === "validation")
        errorContent = c.message ?? `Invalid Filter Value for Column: ${c.id}`;

      const button = (
        <Button
          key={c.id}
          size="sm"
          variant="destructive-outline"
          className="disabled:opacity-100"
          disabled
        >
          {errorContent}
        </Button>
      );

      return c.type === "column" ? (
        button
      ) : (
        <Tooltip key={c.id}>
          <TooltipTrigger render={button} />
          <TooltipPopup className="text-destructive">
            <pre>{JSON.stringify(c.error, null, 2)}</pre>
          </TooltipPopup>
        </Tooltip>
      );
    }

    const Icon = c.columnMeta?.icon;

    return (
      <ButtonGroup
        key={c.columnId}
        className={cn("**:text-xs", className)}
        {...props}
      >
        <Button
          size="sm"
          variant="outline"
          className="disabled:opacity-100"
          disabled
        >
          {Icon && <Icon />}
          {c.columnMeta?.label ?? c.columnId}
        </Button>

        <FilterOperatorSelector context={c} />

        <FilterValueDisplayPopup context={c} size="sm" variant="outline">
          <FilterValueController context={c} />
        </FilterValueDisplayPopup>

        <Button
          size="icon-sm"
          variant="destructive-outline"
          onClick={() => c.setFilter(undefined)}
        >
          <XIcon />
        </Button>
      </ButtonGroup>
    );
  });
}
