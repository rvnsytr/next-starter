"use client";

import {
  BrushCleaningIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  TrashIcon,
  ZoomInIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { fileTypeConfig, FileTypeConfig } from "../config/file-type";
import { FileUploadOptions, useFileUpload } from "../hooks/use-file-upload";
import { messages } from "../messages";
import { cn, formatBytes } from "../utils";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./ui/alert";
import { Button, ResetButton } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Dialog, DialogHeader, DialogPopup, DialogTitle } from "./ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

export type FileUploadProps = Pick<
  React.ComponentProps<"input">,
  "id" | "name" | "required"
> &
  Partial<Pick<FileTypeConfig, "displayName" | "icon" | "extensions">> &
  FileUploadOptions & {
    classNames?: {
      container?: string;
      dropzone?: string;
      files?: string;
      file?: string;
    };
    sortable?: boolean;
  };

export function FileUpload({
  id,
  name,
  required,

  displayName = fileTypeConfig.file.displayName,
  icon: Icon = fileTypeConfig.file.icon,
  extensions = [],

  classNames,
  sortable = false,
  ...options
}: FileUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [
    { files, errors },
    {
      removeFile,
      clearErrors,
      clearFiles,
      moveUp,
      moveDown,

      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,

      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload(options);

  const { maxSize, maxFiles, multiple = false } = options;
  const isFiles = files.length > 0;
  const isErrors = errors.length > 0;

  return (
    <div
      data-slot="file-upload"
      className={cn(
        "group/file-upload relative flex w-full flex-col gap-y-4",
        classNames?.container,
      )}
    >
      <Input
        tabIndex={-1}
        className="sr-only hidden"
        aria-label="file-upload-input"
        {...getInputProps({ id, name, required })}
      />

      {/* Dropzone */}
      <Empty
        data-slot="file-upload-dropzone"
        tabIndex={0}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFileDialog();
          }
        }}
        className={cn(
          "border-input text-foreground ring-ring/24 focus-visible:has-aria-invalid:border-destructive focus-visible:has-aria-invalid:ring-destructive/20 has-aria-invalid:border-destructive/50 focus-visible:border-ring dark:has-aria-invalid:ring-destructive/40 focus-visible:ring-ring/50 relative inline-flex w-full rounded-xl border text-sm shadow-xs/5 transition-shadow not-dark:bg-clip-padding before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-has-disabled:not-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:ring-[3px] has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none dark:not-has-disabled:not-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
          "group/file-upload-dropzone hover:bg-muted dark:hover:bg-muted/50 w-full cursor-pointer outline-none",
          classNames?.dropzone,
        )}
      >
        <EmptyHeader className="max-w-full *:data-[slot=empty-media]:mb-2">
          <EmptyMedia variant="icon" stacked={multiple}>
            <Icon />
          </EmptyMedia>

          <EmptyTitle className="text-sm">
            Seret dan lepaskan {displayName.toLowerCase()} di sini, atau klik
            untuk mengunggah
          </EmptyTitle>

          <EmptyDescription
            className={cn(
              "flex flex-col items-center gap-y-1 text-center text-xs",
              "**:[b]:font-normal **:[svg]:hidden **:[svg]:size-4 sm:**:[svg]:block",
            )}
          >
            <span>
              {extensions.length ? (
                <span>
                  Mendukung <b>{extensions.join(", ")}</b>
                </span>
              ) : (
                <span>Mendukung berbagai jenis {displayName}</span>
              )}
            </span>

            {maxSize && (
              <span>
                Ukuran maksimum <b>{formatBytes(maxSize)}</b>
              </span>
            )}

            {maxFiles && (
              <span>
                {`Maksimal `}
                <b>
                  {maxFiles} {displayName}
                </b>
              </span>
            )}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>

      {/* Action */}
      {(isFiles || isErrors) && (
        <div
          data-slot="file-upload-action"
          className="flex flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-x-2 tabular-nums">
            <Label className="font-normal capitalize">
              {`${displayName} (${maxFiles ? `${files.length}/${maxFiles}` : files.length})`}
            </Label>
            <Separator orientation="vertical" className="h-3.5" />
            <small className="text-muted-foreground text-xs">
              {formatBytes(files.reduce((acc, f) => acc + f.file.size, 0))}
            </small>
          </div>

          {isFiles && (
            <ResetButton
              size="sm"
              variant="destructive-outline"
              onClick={clearFiles}
            />
          )}
        </div>
      )}

      {/* Files */}
      {isFiles && (
        <div
          data-slot="file-upload-files"
          className={cn(
            "grid grid-cols-2 gap-2 sm:grid-cols-4",
            classNames?.files,
          )}
        >
          {files.map((file, index) => {
            const isImage = file.file.type.startsWith("image/");

            // const res = sharedSchemas
            //   .files(accept, { maxFileSize: fileSize.bytes })
            //   .safeParse([file]);

            const Comp = (
              <div
                tabIndex={0}
                data-slot="file"
                className={cn(
                  "group/file relative aspect-3/4 overflow-hidden rounded-xl border",
                  "focus-visible:border-ring focus-visible:ring-ring/50 outline-0 focus-visible:ring-[3px]",

                  isImage ? "bg-black text-white" : "bg-card text-foreground",
                  isImage && file.preview && "cursor-pointer",

                  classNames?.file,
                )}
                onClick={() => {
                  if (isImage && file.preview) setSelectedImage(file.preview);
                }}
              >
                {isImage && (
                  <div className="absolute z-10 size-full bg-black/60 mask-t-from-0 mask-t-to-40%" />
                )}

                {isImage && !!file.preview && (
                  <>
                    <Image
                      data-slot="file-media"
                      src={file.preview}
                      alt={file.file.name}
                      width={64}
                      height={64}
                      className={cn(
                        "object-cover object-center",
                        "z-0 size-full opacity-100 transition duration-200",
                        !!file.preview &&
                          "group-hover/file:scale-105 group-hover/file:opacity-80 group-focus-visible/file:scale-105 group-focus-visible/file:opacity-80",
                      )}
                    />

                    <div
                      className={cn(
                        "flex items-center justify-center",
                        "absolute inset-0 z-10 size-full opacity-0 duration-200",
                        !!file.preview &&
                          "group-hover/file:opacity-80 group-focus-visible/file:opacity-80",
                      )}
                    >
                      <div className="rounded-full bg-black/60 p-1.5">
                        <ZoomInIcon className="size-4" />
                      </div>
                    </div>
                  </>
                )}

                {!isImage && !!file.preview && (
                  <div className="z-0 flex size-full items-center justify-center">
                    <div
                      className={cn(
                        "bg-accent relative flex items-center justify-center rounded-full p-1.5",
                        "*:size-4 *:transition *:duration-200",
                      )}
                    >
                      <Icon
                        className={cn(
                          "opacity-100",
                          !!file.preview && "group-hover/file:opacity-0",
                        )}
                      />

                      <ZoomInIcon
                        className={cn(
                          "absolute opacity-0",
                          !!file.preview && "group-hover/file:opacity-100",
                        )}
                      />
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    "absolute bottom-0 z-10",
                    "grid gap-y-1 p-3 break-all",
                    "*:line-clamp-1 *:w-fit *:cursor-text",
                  )}
                >
                  <p className="text-sm font-medium">{file.file.name}</p>
                  <small className="text-xs">
                    {formatBytes(file.file.size)}
                  </small>
                </div>
              </div>
            );

            return (
              <div key={index} data-slot="file-container" className="relative">
                {!isImage && !!file.preview ? (
                  <Link href={file.preview} target="_blank">
                    {Comp}
                  </Link>
                ) : (
                  Comp
                )}

                <Button
                  data-slot="remove-file"
                  type="button"
                  size="icon-sm"
                  variant="destructive"
                  className="absolute top-2 left-2 z-10"
                  onClick={() => removeFile(file.id)}
                >
                  <TrashIcon />
                </Button>

                {sortable && (
                  <ButtonGroup className="absolute top-2 right-2 z-10">
                    <Button
                      data-slot="file-move-up"
                      type="button"
                      size="icon-sm"
                      className="border-border bg-white text-black/80"
                      onClick={() => moveUp(file.id)}
                      disabled={files.length === 1}
                    >
                      <ChevronLeftIcon />
                    </Button>
                    {/* <ButtonGroupSeparator /> */}
                    <Button
                      data-slot="file-move-down"
                      type="button"
                      size="icon-sm"
                      className="border-border bg-white text-black/80"
                      onClick={() => moveDown(file.id)}
                      disabled={files.length === 1}
                    >
                      <ChevronRightIcon />
                    </Button>
                  </ButtonGroup>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Errors */}
      {isErrors && (
        <Alert data-slot="file-errors" variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            <ul className="ml-3 list-disc">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
          <AlertAction>
            <Button
              size="sm"
              variant="destructive-outline"
              onClick={clearErrors}
            >
              <BrushCleaningIcon /> {messages.actions.clear}
            </Button>
          </AlertAction>
        </Alert>
      )}

      {/* Image Preview */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogPopup>
          <DialogHeader className="sr-only">
            <DialogTitle>{displayName} Preview</DialogTitle>
          </DialogHeader>

          {selectedImage && (
            <Image
              src={selectedImage}
              alt={`${displayName} Preview`}
              width={1280}
              height={720}
              className="rounded-lg"
            />
          )}
        </DialogPopup>
      </Dialog>
    </div>
  );
}
