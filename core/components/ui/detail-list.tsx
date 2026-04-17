import { cn } from "@/core/utils";
import { Label } from "./label";

export type DetailListData = {
  label: string;
  content?:
    | string
    | React.ReactElement
    | { label: string; content?: React.ReactNode }[];
  className?: string;
  classNames?: { label?: string; content?: string };
}[];

export function DetailList({
  data,
  className,
  classNames,
}: Pick<DetailListData[number], "className" | "classNames"> & {
  data: DetailListData;
}) {
  return data.map((item, index) => (
    <div
      key={index}
      className={cn(
        "flex flex-col gap-x-2 gap-y-1 **:[svg:not([class*='size-'])]:size-4",
        className,
        item.className,
      )}
    >
      <Label className={cn(classNames?.label, item.classNames?.label)}>
        {item.label}
      </Label>
      <div
        className={cn(
          "text-muted-foreground text-sm",
          classNames?.content,
          item.classNames?.content,
        )}
      >
        {Array.isArray(item.content) ? (
          <ul className="list-inside list-disc">
            {item.content.map((item) => (
              <li key={item.label} className="font-normal">
                {`${item.label}: `}
                <span className="text-foreground">{item.content ?? "-"}</span>
              </li>
            ))}
          </ul>
        ) : (
          (item.content ?? "-")
        )}
      </div>
    </div>
  ));
}
