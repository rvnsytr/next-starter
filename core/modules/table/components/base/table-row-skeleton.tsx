import { Skeleton } from "@/core/components/ui/skeleton";
import { TableCell, TableRow } from "@/core/components/ui/table";

export function TableRowSkeleton({ columnLength }: { columnLength: number }) {
  return (
    <TableRow>
      <TableCell colSpan={columnLength}>
        <Skeleton className="h-7 w-full" />
      </TableCell>
    </TableRow>
  );
}
