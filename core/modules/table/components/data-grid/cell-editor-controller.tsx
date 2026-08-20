import { Form } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { toast } from "@/core/components/ui/toast";
import {
  ColumnMeta,
  DataGridCellEditorMeta,
  DataGridCellEditorType,
} from "@/core/modules/table/types";
import { Override } from "@/core/types";
import { cn } from "@/core/utils";
import { ErrorFallback } from "@/shared/components/fallback";
import { sharedSchemas } from "@/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CellData } from "@tanstack/react-table";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type CellEditorControllerProps = {
  columnMeta?: ColumnMeta;
  editorMeta: DataGridCellEditorMeta;
  defaultValue?: CellData;
  onSubmit: (data: CellData) => void;
};

export function CellEditorController({
  editorMeta,
  ...props
}: CellEditorControllerProps) {
  switch (editorMeta.type) {
    case "string":
      return <StringCellEditor editorMeta={editorMeta} {...props} />;
    case "number":
      return <NumberCellEditor editorMeta={editorMeta} {...props} />;
    default: {
      return (
        <ErrorFallback
          error="Unsupported Editor Type"
          className="rounded-none border-none"
          hideCode
          hideError
        />
      );
    }
  }
}

type CellEditorMeta<T extends DataGridCellEditorType> = Override<
  CellEditorControllerProps,
  { editorMeta: Extract<DataGridCellEditorMeta, { type: T }> }
>;

export function StringCellEditor({
  columnMeta,
  editorMeta,
  defaultValue: dv,
  onSubmit,
}: CellEditorMeta<"string">) {
  type FormSchema = z.infer<typeof formSchema>;

  const schema =
    editorMeta.schema ?? sharedSchemas.string({ withRequired: true });
  const defaultValue = schema.catch("").parse(dv);

  const formSchema = z.object({ string: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { string: defaultValue },
  });

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => onSubmit(formData.string),
    (e) => {
      const title = "Invalid value";
      const description = e.string?.message ?? "Please enter a valid value.";
      toast.add({ type: "error", title, description });
    },
  );

  const label = columnMeta?.label ? columnMeta.label.toLowerCase() : "a value";

  return (
    <Form onSubmit={onFormSubmit}>
      <Controller
        name="string"
        control={form.control}
        render={({ field, fieldState }) => (
          <Input
            placeholder={`Enter ${label}`}
            className={cn(fieldState.invalid && "*:text-destructive")}
            unstyled
            autoFocus
            {...field}
          />
        )}
      />
    </Form>
  );
}

export function NumberCellEditor({
  columnMeta,
  editorMeta,
  defaultValue: dv,
  onSubmit,
}: CellEditorMeta<"number">) {
  type FormSchema = z.infer<typeof formSchema>;

  const schema =
    editorMeta.schema ?? sharedSchemas.number({ withRequired: true });
  const defaultValue = schema.catch(0).parse(dv);

  const formSchema = z.object({ number: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { number: defaultValue },
  });

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => onSubmit(formData.number),
    (e) => {
      const title = "Invalid value";
      const description = e.number?.message ?? "Please enter a valid value.";
      toast.add({ type: "error", title, description });
    },
  );

  const label = columnMeta?.label ? columnMeta.label.toLowerCase() : "a number";

  return (
    <Form onSubmit={onFormSubmit}>
      <Controller
        name="number"
        control={form.control}
        render={({ field: { onChange, ...field }, fieldState }) => (
          <Input
            type="number"
            placeholder={`Enter ${label}`}
            className={cn(fieldState.invalid && "*:text-destructive")}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") return onChange(undefined);
              const number = Number(value);
              if (Number.isFinite(number)) onChange(number);
            }}
            unstyled
            autoFocus
            {...field}
          />
        )}
      />
    </Form>
  );
}
