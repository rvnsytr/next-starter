import { cn } from "@/core/utils";
import { Label } from "./label";

export type DetailListProps = {
  data: {
    label: string;
    content: React.ReactNode;
    className?: string;
    classNames?: { label?: string; content?: string };
  }[];
};

export function DetailList({ data }: DetailListProps) {
  return data.map(({ label, content, className, classNames }, index) => (
    <div key={index} className={cn("space-y-1", className)}>
      <Label className={classNames?.label}>{label}</Label>
      <div className={cn("text-muted-foreground text-sm", classNames?.content)}>
        {content ?? "-"}
      </div>
    </div>
  ));
}
