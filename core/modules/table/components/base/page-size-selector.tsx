import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/core/modules/table/constants";
import { cn, formatNumber } from "@/core/utils";

export type PageSizeSelectorProps = React.ComponentProps<typeof SelectTrigger>;

type PageSizeSelectorContext = {
  defaultPageSize?: number;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
};

export function PageSizeSelector({
  context,
  className,
  ...props
}: PageSizeSelectorProps & { context: PageSizeSelectorContext }) {
  const basePageSize = context.defaultPageSize ?? DEFAULT_PAGE_SIZE;
  return (
    <Select
      value={String(context.pageSize)}
      onValueChange={(v) => context.onPageSizeChange(Number(v))}
    >
      <SelectTrigger className={cn("w-fit min-w-fit", className)} {...props}>
        <SelectValue />
      </SelectTrigger>

      <SelectPopup>
        {PAGE_SIZES.map((v) => (
          <SelectItem
            key={v}
            value={String(v)}
            className={cn(v === basePageSize && "font-semibold")}
          >
            {formatNumber(v)}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
