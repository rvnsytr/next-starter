"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronsUpDown,
  FileSpreadsheetIcon,
  ImportIcon,
  PlusIcon,
  RefreshCcwDot,
  RotateCcwIcon,
  Settings2Icon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { TextMorph } from "torph/react";
import z from "zod";
import { fileTypeConfig } from "../config/file-type";
import { FileWithPreview } from "../hooks/use-file-upload";
import { messages } from "../messages";
import { sharedSchemas } from "../schema";
import {
  cn,
  formatCsvRange,
  formatNumber,
  formatNumberRange,
  getExcelColumnKey,
  sanitizeNumber,
} from "../utils";
import { FileUpload } from "./file-upload";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Fieldset, FieldsetLegend } from "./ui/fieldset";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group";
import { Separator } from "./ui/separator";
import { LoadingSpinner } from "./ui/spinner";
import { toast } from "./ui/toast";

type ReadExcelSheetMode = (typeof allReadExcelSheetModes)[number];
const allReadExcelSheetModes = ["include", "exclude"] as const;
const defaultMode: ReadExcelSheetMode = "include";

type ImportDialogFormSchema = z.infer<typeof importDialogSchema>;

export type ImportDialogProps<T, K extends string> = {
  source: Record<K, Omit<ImportDialogFormSchema["source"][number], "key">>;
  defaultValues?: Partial<Omit<ImportDialogFormSchema, "source">>;

  onSubmit: (data: {
    files: FileWithPreview[];
    sheet: string;
    mode: ReadExcelSheetMode;
    rows: number[];
    source: Record<K, number>;
  }) => Promise<T>;
  onSuccess?: (response: T) => string | undefined;
  onError?: (error: unknown) => string | undefined;

  title?: string;
  description?: React.ReactNode;
  className?: string;
  multiple?: boolean;

  renderTrigger?: React.ReactElement;
  children?: React.ReactNode;
};

const importDialogSchema = z.object({
  files: sharedSchemas.filesWithPreview("spreadsheet", { minFiles: 1 }),
  sheet: sharedSchemas.string({ label: "Worksheet" }),
  mode: z.enum(allReadExcelSheetModes),
  rows: sharedSchemas.string({ label: "Lewati baris" }),
  source: z
    .object({
      key: sharedSchemas.string({ min: 1, withRequired: true }),
      label: sharedSchemas.string({ min: 1 }),
      column: sharedSchemas.number({ label: "Nomor kolom", min: 1 }),
      required: z.boolean().optional(),
    })
    .array(),
});

export function ImportDialog<T, K extends string>({
  source,
  defaultValues,

  onSubmit,
  onSuccess,
  onError,

  title,
  description,
  className,
  multiple = true,

  renderTrigger,
  children,
}: ImportDialogProps<T, K>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<ReadExcelSheetMode>(defaultMode);

  const isInclude = mode === "include";

  const form = useForm<ImportDialogFormSchema>({
    resolver: zodResolver(importDialogSchema),
    defaultValues: {
      files: [],
      sheet: defaultValues?.sheet ?? "",
      mode: defaultValues?.mode ?? defaultMode,
      rows: defaultValues?.rows ?? "",
      source: Object.entries(source).map(([k, v]) => ({
        key: k,
        ...(v as ImportDialogFormSchema["source"]),
      })),
    },
  });

  const { fields: sourceFields } = useFieldArray({
    control: form.control,
    name: "source",
  });

  const parse = (value: string) =>
    formatCsvRange(value, { sort: "asc", distinct: true });

  const formHandler = (formData: ImportDialogFormSchema) => {
    setIsLoading(true);

    toast.promise(
      onSubmit({
        ...formData,
        source: Object.fromEntries(
          formData.source.map((v) => [v.key, v.column]),
        ) as Record<K, number>,
        rows: parse(formData.rows),
      }),
      {
        loading: { title: messages.loading },
        success: (res) => {
          setMode(defaultMode);
          setIsLoading(false);
          form.reset();
          const message = onSuccess?.(res);
          return { title: message ?? messages.success };
        },
        error: (e) => {
          setIsLoading(false);
          const message = onError?.(e);
          return { title: message ?? e.message };
        },
      },
    );
  };

  const trigger = renderTrigger ?? (
    <Button>
      <ImportIcon /> Import
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogPopup className={className}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-x-2">
            <ImportIcon /> {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(formHandler)} noValidate>
          <Controller
            name="files"
            control={form.control}
            render={({ field: { value, onChange, ...field }, fieldState }) => {
              const config = fileTypeConfig.spreadsheet;
              return (
                <Field name={field.name} invalid={fieldState.invalid}>
                  <FieldLabel>{config.displayName}</FieldLabel>
                  <FileUpload
                    {...config}
                    files={value}
                    onFilesChange={onChange}
                    multiple={multiple}
                    sortable
                    {...field}
                  />
                  <FieldError error={fieldState.error} />
                </Field>
              );
            }}
          />

          <Separator />

          <Collapsible>
            <Fieldset>
              <div className="flex justify-between gap-x-2">
                <div>
                  <FieldsetLegend>
                    <Settings2Icon /> Konfigurasi
                  </FieldsetLegend>

                  <FieldDescription>
                    Atur dan konfigurasi spreadsheet sesuai dengan data yang
                    dibutuhkan.
                  </FieldDescription>
                </div>

                <CollapsibleTrigger
                  render={
                    <Button size="sm" variant="ghost" className="h-auto">
                      <ChevronsUpDown />
                    </Button>
                  }
                />
              </div>

              <CollapsiblePanel>
                <Controller
                  name="sheet"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field name={field.name} invalid={fieldState.invalid}>
                      <FieldLabel>Worksheet</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          placeholder="Sheet1"
                          required
                          {...field}
                        />
                        <InputGroupAddon>
                          <FileSpreadsheetIcon />
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldError error={fieldState.error} />
                    </Field>
                  )}
                />

                <Controller
                  name="rows"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const rows = formatNumberRange(parse(field.value));
                    return (
                      <Field name={field.name} invalid={fieldState.invalid}>
                        <InputGroup>
                          <InputGroupAddon
                            align="block-start"
                            className="justify-between"
                          >
                            <div
                              className={cn(
                                "relative flex items-center gap-x-1 *:transition",
                                !isInclude && "text-destructive",
                              )}
                            >
                              <XIcon
                                className={cn(
                                  "size-4",
                                  isInclude ? "scale-0" : "scale-100",
                                )}
                              />
                              <PlusIcon
                                className={cn(
                                  "absolute size-4",
                                  isInclude ? "scale-100" : "scale-0",
                                )}
                              />

                              <TextMorph>
                                {isInclude ? "Muat baris" : "Lewati baris"}
                              </TextMorph>
                            </div>

                            <Button
                              type="button"
                              size="icon-xs"
                              variant="outline"
                              className="z-10"
                              onClick={() =>
                                setMode((prev) => {
                                  const newMode =
                                    prev === "include" ? "exclude" : "include";
                                  form.setValue("mode", newMode);
                                  return newMode;
                                })
                              }
                            >
                              <RefreshCcwDot />
                            </Button>
                          </InputGroupAddon>

                          <InputGroupInput
                            id={field.name}
                            aria-invalid={!!fieldState.error}
                            placeholder="e.g. 1-29, 4, 19, 12, 3"
                            {...field}
                          />

                          <InputGroupAddon
                            align="block-end"
                            className="border-t"
                          >
                            <InputGroupText
                              className={cn(
                                "gap-1 overflow-x-auto *:text-xs *:transition",
                                isInclude
                                  ? "*:text-foreground *:bg-foreground/10 dark:*:bg-foreground/20"
                                  : "*:text-destructive *:bg-destructive/10 dark:*:bg-destructive/20",
                              )}
                            >
                              {rows.length
                                ? rows.map((v) => <code key={v}>{v}</code>)
                                : "Tidak ada"}
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        <FieldError error={fieldState.error} />
                      </Field>
                    );
                  }}
                />

                <div className="grid gap-y-2">
                  <div className="grid grid-cols-4 gap-x-4 border-b pb-2 *:font-medium">
                    <p className="col-span-2">Data</p>
                    <p>Kolom ke</p>
                    <p>Atau</p>
                  </div>

                  {sourceFields.map((item, index) => (
                    <Controller
                      key={item.id}
                      name={`source.${index}.column`}
                      control={form.control}
                      render={({
                        field: { value, onChange, ...field },
                        fieldState,
                      }) => (
                        <Field
                          data-invalid={!!fieldState.error}
                          className="gap-1"
                        >
                          <div className="grid grid-cols-4 gap-x-4">
                            <FieldLabel
                              htmlFor={field.name}
                              className={cn(
                                "col-span-2",
                                item.required && "label-required",
                              )}
                            >
                              {item.label}
                            </FieldLabel>

                            <InputGroup className="h-6">
                              <InputGroupInput
                                id={field.name}
                                aria-invalid={!!fieldState.error}
                                inputMode="numeric"
                                value={formatNumber(value)}
                                onChange={(e) =>
                                  onChange(sanitizeNumber(e.target.value))
                                }
                                placeholder={item.key}
                                {...field}
                              />
                              <InputGroupAddon align="inline-end">
                                <Button
                                  type="reset"
                                  size="icon-xs"
                                  variant="ghost"
                                  className="size-4"
                                  onClick={() =>
                                    form.resetField(`source.${index}.column`)
                                  }
                                >
                                  <RotateCcwIcon className="size-3.5" />
                                </Button>
                              </InputGroupAddon>
                            </InputGroup>

                            <p>{getExcelColumnKey(value)}</p>
                          </div>

                          <FieldError error={fieldState.error} />
                        </Field>
                      )}
                    />
                  ))}
                </div>
              </CollapsiblePanel>
            </Fieldset>
          </Collapsible>

          {children && (
            <>
              <Separator />
              {children}
            </>
          )}

          <Separator />

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline">{messages.actions.cancel}</Button>
              }
            />
            <Button type="submit" disabled={isLoading}>
              <LoadingSpinner
                loading={isLoading}
                icon={{ base: <ImportIcon /> }}
              />
              {messages.actions.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogPopup>
    </Dialog>
  );
}
