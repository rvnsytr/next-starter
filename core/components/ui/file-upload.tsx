import { fileMeta, FileType, messages } from "@/core/constants";
import { sharedSchemas } from "@/core/schema.zod";
import { cn, toMegabytes } from "@/core/utils";
import { ArrowUpRightIcon, DotIcon, XIcon } from "lucide-react";
import { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  DragEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useRef,
} from "react";
import { Button } from "./button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";
import { Input, InputProps } from "./input";
import { Separator } from "./separator";

export type FileUploadProps = Pick<
  InputProps,
  "id" | "name" | "className" | "multiple" | "required"
> & {
  value: File[];
  onChange: (files: File[]) => void;
  accept?: FileType;
  maxSize?: number;
  classNames?: { container?: string; dropzone?: string; files?: string };
};

export function FileUpload({
  id,
  name,
  value,
  onChange,
  accept = "file",
  maxSize,
  className,
  classNames,
  multiple = false,
  required = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    displayName,
    mimeTypes,
    extensions,
    size,
    icon: Icon,
  } = fileMeta[accept];

  const valueLength = value?.length || 0;
  const isFiles = valueLength > 0;
  const fileSize = maxSize
    ? { mb: toMegabytes(maxSize), bytes: maxSize }
    : size;

  const changeHandler = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const fileArray = Array.from(fileList);
    if (isFiles && multiple) onChange([...value, ...fileArray]);
    else onChange(fileArray);
  };

  const removeFile = (index: number) => {
    const filteredFiles = value.filter((_, i) => i !== index);
    onChange(filteredFiles);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetFiles = useCallback(() => onChange([]), []);

  const handleOnClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    inputRef.current?.click();
  }, []);

  const handleOnKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }, []);

  const handleOnDrop = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    changeHandler(e.dataTransfer.files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragEnterAndOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div
      className={cn(
        "relative mb-2 flex w-full flex-col gap-y-4",
        classNames?.container,
      )}
    >
      <Input
        id={id}
        name={name}
        type="file"
        tabIndex={-1}
        ref={inputRef}
        multiple={multiple}
        accept={mimeTypes.join(", ")}
        className={cn("absolute -z-1 opacity-0")}
        onChange={({ target }) => changeHandler(target.files)}
        required={required}
      />

      <Empty
        tabIndex={0}
        onClick={handleOnClick}
        onKeyDown={handleOnKeyDown}
        onDrop={handleOnDrop}
        onDragEnter={handleDragEnterAndOver}
        onDragOver={handleDragEnterAndOver}
        className={cn(
          "group border-input hover:border-muted-foreground gap-2 border border-dashed transition outline-none hover:cursor-pointer",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          classNames?.dropzone,
        )}
      >
        <EmptyHeader>
          <EmptyMedia
            className={cn(
              "text-muted-foreground rounded-full border transition",
              "group-hover:text-foreground group-hover:border-muted-foreground group-focus:text-foreground group-focus:border-muted-foreground",
            )}
            variant="icon"
          >
            <Icon />
          </EmptyMedia>
        </EmptyHeader>

        <EmptyTitle className="text-sm">
          Seret dan lepaskan {displayName.toLowerCase()} di sini, atau klik
          untuk mengunggah
        </EmptyTitle>

        <EmptyDescription className="flex flex-col gap-y-2 text-xs md:flex-row md:items-center">
          <span>Maksimal {fileSize.mb} MB</span>
          {extensions.length > 0 && (
            <>
              <DotIcon className="hidden md:block" />
              <span>{`( ${extensions.join(" ")} )`}</span>
            </>
          )}
        </EmptyDescription>
      </Empty>

      {isFiles && multiple && (
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-x-2 tabular-nums">
            <small className="font-medium capitalize">
              Total {valueLength} {displayName.toLowerCase()}
            </small>
            <Separator orientation="vertical" className="h-4" />
            <small className="text-muted-foreground text-xs">
              {`${toMegabytes(
                value.reduce((acc, v) => (acc += v.size), 0),
              ).toFixed(2)} MB`}
            </small>
          </div>

          <Button
            type="button"
            variant="outline_destructive"
            onClick={resetFiles}
          >
            <XIcon /> {messages.actions.clear}
          </Button>
        </div>
      )}

      {isFiles && (
        <div className={cn("grid gap-2 md:grid-cols-4", className)}>
          {value.map((file, index) => {
            const fileURL = URL.createObjectURL(file);
            const isImage = file.type.startsWith("image/");

            const res = sharedSchemas
              .files(accept, { maxFileSize: fileSize.bytes })
              .safeParse([file]);

            return (
              <div key={fileURL} className="relative rounded-md border">
                <Button
                  type="button"
                  onClick={() => removeFile(index)}
                  size="icon-xs"
                  variant="destructive"
                  className="absolute -top-2 -right-2 z-10 rounded-full hover:cursor-pointer"
                >
                  <XIcon />
                </Button>

                <Link
                  href={fileURL as Route}
                  target="_blank"
                  className={cn(
                    "group flex aspect-square w-full items-center justify-center overflow-hidden rounded-t-md",
                    classNames?.files,
                  )}
                >
                  {isImage ? (
                    <Image
                      src={fileURL}
                      alt={file.name}
                      width={100}
                      height={100}
                      className="size-full object-cover object-center transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className={cn(
                        "bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full border transition-colors",
                        !res.success
                          ? "bg-destructive/60 group-hover:bg-destructive text-foreground border-none"
                          : "group-hover:border-foreground group-hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                  )}
                </Link>

                <div className="grid gap-y-1 border-t p-3 break-all *:line-clamp-1">
                  <Link
                    href={fileURL as Route}
                    target="_blank"
                    className={cn(
                      "w-fit text-sm font-medium hover:underline",
                      !res.success && "text-destructive",
                    )}
                  >
                    <span className="flex gap-x-2">
                      {file.name}{" "}
                      <ArrowUpRightIcon className="size-4 shrink-0" />
                    </span>
                  </Link>

                  <small
                    className={cn(
                      "text-muted-foreground text-xs",
                      !res.success && "text-destructive",
                    )}
                  >
                    {toMegabytes(file.size).toFixed(2)} MB
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
