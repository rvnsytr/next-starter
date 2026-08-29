import { Checkbox } from "@/core/components/ui/checkbox";
import { Form } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Switch } from "@/core/components/ui/switch";
import { Textarea } from "@/core/components/ui/textarea";
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
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type CellEditorControllerProps = {
  columnMeta?: ColumnMeta;
  editorMeta: DataGridCellEditorMeta;
  defaultValue?: CellData;
  onSubmit: (data: CellData) => void;
};

function errorToast(errorMessage?: string) {
  const title = "Invalid value";
  const description = errorMessage ?? "Please enter a valid value.";
  toast.add({ type: "error", title, description });
}

export function CellEditorController({
  editorMeta,
  ...props
}: CellEditorControllerProps) {
  switch (editorMeta.type) {
    case "string":
    case "string:textarea":
      return <StringCellEditor editorMeta={editorMeta} {...props} />;

    case "number":
      return <NumberCellEditor editorMeta={editorMeta} {...props} />;

    case "boolean":
    case "boolean:switch":
      return <BooleanCellEditor editorMeta={editorMeta} {...props} />;

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

function StringCellEditor({
  columnMeta,
  editorMeta,
  defaultValue: dv,
  onSubmit,
}: CellEditorMeta<"string" | "string:textarea">) {
  type FormSchema = z.infer<typeof formSchema>;

  const schema =
    editorMeta.schema ?? sharedSchemas.string({ withRequired: true });
  const defaultValue = schema.catch("").parse(dv);

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: defaultValue },
  });

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => onSubmit(formData.value),
    (e) => errorToast(e.value?.message),
  );

  useEffect(() => form.setFocus("value"), [form]);

  const label = columnMeta?.label ? columnMeta.label.toLowerCase() : "a value";

  return (
    <Form onSubmit={onFormSubmit}>
      <Controller
        name="value"
        control={form.control}
        render={({ field, fieldState }) => {
          if (editorMeta.type === "string:textarea") {
            const {
              placeholder = `Enter ${label}`,
              className,
              ...props
            } = editorMeta.props ?? {};

            return (
              <Textarea
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === "Enter") {
                    e.preventDefault();
                    onFormSubmit();
                  }
                }}
                placeholder={placeholder}
                className={cn(
                  fieldState.invalid && "*:text-destructive",
                  className,
                )}
                unstyled
                {...field}
                {...props}
              />
            );
          }

          const {
            type = "text",
            placeholder = `Enter ${label}`,
            className,
            ...props
          } = editorMeta.props ?? {};

          return (
            <Input
              type={type}
              placeholder={placeholder}
              className={cn(
                fieldState.invalid && "*:text-destructive",
                className,
              )}
              unstyled
              {...field}
              {...props}
            />
          );
        }}
      />
    </Form>
  );
}

function NumberCellEditor({
  columnMeta,
  editorMeta,
  defaultValue: dv,
  onSubmit,
}: CellEditorMeta<"number">) {
  type FormSchema = z.infer<typeof formSchema>;

  const schema =
    editorMeta.schema ??
    sharedSchemas.number({ coerce: true, withRequired: true });
  const defaultValue = schema.catch(0).parse(dv);

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: defaultValue },
  });

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => onSubmit(formData.value),
    (e) => errorToast(e.value?.message),
  );

  useEffect(() => form.setFocus("value"), [form]);

  const label = columnMeta?.label ? columnMeta.label.toLowerCase() : "a number";
  const {
    type = "number",
    placeholder = `Enter ${label}`,
    className,
    ...props
  } = editorMeta.props ?? {};

  return (
    <Form onSubmit={onFormSubmit}>
      <Controller
        name="value"
        control={form.control}
        render={({ field, fieldState }) => (
          <Input
            type={type}
            placeholder={placeholder}
            className={cn(
              fieldState.invalid && "*:text-destructive",
              className,
            )}
            unstyled
            {...field}
            {...props}
          />
        )}
      />
    </Form>
  );
}

function BooleanCellEditor({
  // columnMeta,
  editorMeta,
  defaultValue: dv,
  onSubmit,
}: CellEditorMeta<"boolean" | "boolean:switch">) {
  type FormSchema = z.infer<typeof formSchema>;

  const schema = editorMeta.schema ?? sharedSchemas.boolean();
  const defaultValue = schema.catch(true).parse(dv);

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: defaultValue },
  });

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => onSubmit(formData.value),
    (e) => errorToast(e.value?.message),
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onFormSubmit();
    }
  };

  useEffect(() => form.setFocus("value"), [form]);

  return (
    <Form onSubmit={onFormSubmit}>
      <Controller
        name="value"
        control={form.control}
        render={({ field: { value, onChange, ...field } }) => {
          if (editorMeta.type === "boolean") {
            const { onKeyDown, className, ...props } = editorMeta.props ?? {};
            return (
              <Checkbox
                checked={value}
                onCheckedChange={onChange}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                  onKeyDown?.(e);
                }}
                className={cn("mx-auto", className)}
                {...field}
                {...props}
              />
            );
          }

          const { onKeyDown, className, ...props } = editorMeta.props ?? {};
          return (
            <Switch
              checked={value}
              onCheckedChange={onChange}
              onKeyDown={(e) => {
                handleKeyDown(e);
                onKeyDown?.(e);
              }}
              className={cn("mx-auto", className)}
              {...field}
              {...props}
            />
          );
        }}
      />
    </Form>
  );
}

// const items = [
//   { label: "Select framework", value: null },
//   { label: "Next.js", value: "next" },
//   { label: "Vite", value: "vite" },
//   { label: "Astro", value: "astro" },
// ];

// <div className="flex items-center justify-center py-12">
//   <Select items={items}>
//     <SelectPrimitive.Trigger>
//       <Badge>Admin</Badge>
//     </SelectPrimitive.Trigger>

//     <SelectPopup align="center" alignItemWithTrigger={false}>
//       <SelectLabel>Frameworks</SelectLabel>
//       {items.map((item) => (
//         <SelectItem key={item.value} value={item}>
//           {item.label}
//         </SelectItem>
//       ))}
//     </SelectPopup>
//   </Select>
// </div>;
