import { cn } from "@/core/utils";
import { Label } from "./label";

export type DetailListData = {
  label: string;
  content?:
    | React.ReactNode
    | { subLabel: string; subContent?: React.ReactNode }[];
  className?: string;
  classNames?: { label?: string; content?: string };
}[];

export function DetailList({ data }: { data: DetailListData }) {
  return data.map(({ label, content, className, classNames }, index) => (
    <div
      key={index}
      className={cn(
        "space-y-1 **:[svg:not([class*='size-'])]:size-4",
        className,
      )}
    >
      <Label className={classNames?.label}>{label}</Label>
      <div className={cn("text-muted-foreground text-sm", classNames?.content)}>
        {Array.isArray(content) ? (
          <ul className="list-inside list-disc">
            {content.map(({ subLabel, subContent }) => (
              <li key={subLabel}>
                <span className="capitalize">{subLabel}</span>:{" "}
                <span className="text-foreground font-medium">
                  {subContent ?? "-"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          (content ?? "-")
        )}
      </div>
    </div>
  ));
}
