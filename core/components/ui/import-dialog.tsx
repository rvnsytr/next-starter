"use client";

import { messages } from "@/core/constants/messages";
import { sharedSchemas } from "@/core/schema.zod";
import {
  formatCsvRange,
  formatNumber,
  formatNumberRange,
  sanitizeNumber,
} from "@/core/utils/formaters";
import { getExcelColumnKey } from "@/core/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileSpreadsheetIcon,
  ImportIcon,
  ListXIcon,
  RotateCcwIcon,
  Settings2Icon,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./field";
import { FieldWrapper } from "./field-wrapper";
import { FileUpload } from "./file-upload";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./input-group";
import { Separator } from "./separator";
import { LoadingSpinner } from "./spinner";

type ImportDialogFormSchema = z.infer<typeof importDialogSchema>;

export type ImportDialogProps<T, K extends string> = {
  source: Record<K, { label: string; column: number }>;

  onSubmit: (data: {
    file: z.core.File;
    sheet: string;
    source: Record<K, number>;
    skipRows: number[];
  }) => Promise<T>;
  onSuccess?: (response: T) => string | undefined;
  onError?: (error: unknown) => string | undefined;

  title?: string;
  description?: ReactNode;
  className?: string;

  renderTrigger?: ReactNode;
  children?: ReactNode;
};

const importDialogSchema = z.object({
  file: sharedSchemas.files("spreadsheet", { min: 1 }),
  sheet: sharedSchemas.string("Worksheet"),
  source: z
    .object({
      key: sharedSchemas.string("Key", { min: 1 }),
      label: sharedSchemas.string("Label"),
      column: sharedSchemas.number("Nomor kolom", {
        min: 1,
        withRequired: false,
      }),
    })
    .array(),
  skipRows: sharedSchemas.string("Lewati baris", { sanitize: true }),
});

export function ImportDialog<T, K extends string>({
  source,

  onSubmit,
  onSuccess,
  onError,

  title,
  description,
  className,

  renderTrigger,
  children,
}: ImportDialogProps<T, K>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<ImportDialogFormSchema>({
    resolver: zodResolver(importDialogSchema),
    defaultValues: {
      file: [],
      source: Object.entries(source).map(([k, v]) => ({
        key: k,
        ...(v as { label: string; column: number }),
      })),
      sheet: "",
      skipRows: "1",
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
    setIsOpen(true);

    toast.promise(
      async () =>
        await onSubmit({
          file: formData.file[0],
          sheet: formData.sheet,
          source: Object.fromEntries(
            formData.source.map((v) => [v.key, v.column]),
          ) as Record<K, number>,
          skipRows: parse(formData.skipRows),
        }),
      {
        loading: messages.loading,
        success: (res) => {
          setIsLoading(false);
          setIsOpen(false);
          form.reset();
          const message = onSuccess?.(res);
          return message ?? "Sukses";
        },
        error: (e) => {
          setIsLoading(false);
          const message = onError?.(e);
          return message ?? e.message;
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-x-2">
            <ImportIcon /> {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(formHandler)} noValidate>
          <Controller
            name="file"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldWrapper
                label="Spreadsheet Purnakarya"
                htmlFor={field.name}
                errors={fieldState.error}
              >
                <FileUpload
                  id={field.name}
                  accept="spreadsheet"
                  className="md:grid-cols-2"
                  required
                  {...field}
                />
              </FieldWrapper>
            )}
          />

          <Separator />

          <FieldSet>
            <FieldLegend className="flex items-center gap-x-2">
              <Settings2Icon /> Konfigurasi
            </FieldLegend>

            <FieldDescription>
              Atur dan konfigurasi spreadsheet sesuai dengan data yang
              dibutuhkan.
            </FieldDescription>

            <FieldGroup>
              <Controller
                name="sheet"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldWrapper
                    label="Worksheet"
                    htmlFor={field.name}
                    errors={fieldState.error}
                  >
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        id={field.name}
                        aria-invalid={!!fieldState.error}
                        placeholder="Sheet1"
                        {...field}
                      />
                      <InputGroupAddon>
                        <FileSpreadsheetIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </FieldWrapper>
                )}
              />

              <Controller
                name="skipRows"
                control={form.control}
                render={({ field, fieldState }) => {
                  const rows = formatNumberRange(parse(field.value));
                  return (
                    <FieldWrapper
                      label="Lewati baris"
                      htmlFor={field.name}
                      errors={fieldState.error}
                    >
                      <InputGroup>
                        <InputGroupInput
                          type="text"
                          id={field.name}
                          aria-invalid={!!fieldState.error}
                          placeholder="e.g. 1-29, 4, 19, 12, 3"
                          {...field}
                        />

                        <InputGroupAddon align="block-end" className="border-t">
                          <ListXIcon className="shrink-0" />
                          <InputGroupText className="*:text-destructive *:bg-destructive/10 dark:*:bg-destructive/20 gap-1 overflow-x-auto *:text-xs">
                            {rows.length
                              ? rows.map((v) => <code key={v}>{v}</code>)
                              : "Tidak ada"}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </FieldWrapper>
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
                        className="gap-y-1"
                      >
                        <div className="grid grid-cols-4 gap-x-4">
                          <FieldLabel
                            htmlFor={field.name}
                            className="col-span-2"
                          >
                            {item.label}
                          </FieldLabel>

                          <InputGroup className="h-6">
                            <InputGroupInput
                              type="text"
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

                        <FieldError errors={fieldState.error} />
                      </Field>
                    )}
                  />
                ))}
              </div>
            </FieldGroup>
          </FieldSet>

          {children && (
            <>
              <Separator />
              {children}
            </>
          )}

          <Separator />

          <DialogFooter showCloseButton>
            <Button type="submit" disabled={isLoading}>
              <LoadingSpinner
                loading={isLoading}
                icon={{ base: <ImportIcon /> }}
              />
              {messages.actions.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
