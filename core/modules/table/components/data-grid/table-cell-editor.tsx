import { Checkbox } from "@/core/components/ui/checkbox";
import { Form } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Switch } from "@/core/components/ui/switch";
import { TableCell } from "@/core/components/ui/table";
import { Textarea } from "@/core/components/ui/textarea";
import { toast } from "@/core/components/ui/toast";
import { TABLE_CELL_CLASS } from "@/core/modules/table/constants";
import {
  DataGridCellEditContext,
  DataGridCellEditorMeta,
  DataGridCellEditorType,
  DataGridEditState,
} from "@/core/modules/table/types";
import { sharedSchemas } from "@/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CellData } from "@tanstack/react-table";
import { cn } from "cn";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// function isInteractiveTarget(target: EventTarget | null) {
//   return (
//     target instanceof Element &&
//     !!target.closest(
//       [
//         "a",
//         "button",
//         "input",
//         "select",
//         "textarea",
//         "label",
//         "[contenteditable=true]",
//         "[role=button]",
//         "[data-grid-interactive]",
//       ].join(", "),
//     )
//   );
// }

function errorToast(errorMessage?: string) {
  const title = "Invalid value";
  const description = errorMessage ?? "Please enter a valid value.";
  toast.add({ type: "error", title, description });
}

type TableCellEditorControllerProps = React.ComponentProps<typeof TableCell> & {
  context: DataGridCellEditContext & {
    currentEdit: DataGridEditState | null;
    setCurrentEdit: React.Dispatch<
      React.SetStateAction<DataGridEditState | null>
    >;
    exitCell: () => void;
    handleCellEdit: (
      newValue: CellData,
      context: DataGridCellEditContext,
    ) => void;
  };
};

export function TableCellEditorController({
  context,
  ...props
}: TableCellEditorControllerProps) {
  switch (context.columnMeta?.editor?.type) {
    case "string":
    case "string:textarea":
      return (
        <TableCellEditorString
          context={context}
          editorMeta={context.columnMeta.editor}
          {...props}
        />
      );

    case "number":
      return (
        <TableCellEditorNumber
          context={context}
          editorMeta={context.columnMeta.editor}
          {...props}
        />
      );

    case "boolean":
    case "boolean:switch":
      return (
        <TableCellEditorBoolean
          context={context}
          editorMeta={context.columnMeta.editor}
          {...props}
        />
      );

    default:
      return <TableCell {...props} />;
  }
}

type TableCellEditorProps<T extends DataGridCellEditorType> =
  TableCellEditorControllerProps & {
    editorMeta: Extract<DataGridCellEditorMeta, { type: T }>;
  };

function TableCellEditorString({
  context,
  editorMeta,
  className,
  onDoubleClick,
  children,
  ...props
}: TableCellEditorProps<"string" | "string:textarea">) {
  type FormSchema = z.infer<typeof formSchema>;

  const schema = useMemo(
    () => editorMeta.schema ?? sharedSchemas.string({ withRequired: true }),
    [editorMeta.schema],
  );

  const getCurrentValue = () => schema.catch("").parse(context.cellData);
  const isEdit = context.currentEdit?.cellId === context.cellId;

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: getCurrentValue() },
  });

  useEffect(() => {
    if (isEdit) form.setFocus("value");
  }, [form, isEdit]);

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => {
      context.handleCellEdit(formData.value, context);
      context.setCurrentEdit(null);
    },
    (e) => errorToast(e.value?.message),
  );

  const label = context.columnMeta?.label?.toLowerCase() ?? "a value";

  return (
    <TableCell
      onDoubleClick={(e) => {
        onDoubleClick?.(e);
        if (!context.currentEdit) context.setCurrentEdit(context);
      }}
      className={cn(isEdit && "px-0 py-1", className)}
      {...props}
    >
      {!isEdit && children}

      {isEdit && (
        <Form onSubmit={onFormSubmit}>
          <Controller
            name="value"
            control={form.control}
            render={({ field: { onBlur, ...field }, fieldState }) => {
              if (editorMeta.type === "string:textarea") {
                const {
                  placeholder = `Enter ${label}`,
                  className: textareaCn,
                  ...textareaProps
                } = editorMeta.props ?? {};

                return (
                  <Textarea
                    placeholder={placeholder}
                    className={cn(
                      fieldState.invalid && "*:text-destructive",
                      textareaCn,
                    )}
                    onBlur={() => {
                      form.setValue("value", getCurrentValue());
                      context.setCurrentEdit(null);
                      onBlur();
                    }}
                    onKeyDown={(e) => {
                      if (e.ctrlKey && e.key === "Enter") {
                        e.preventDefault();
                        onFormSubmit();
                      }
                    }}
                    unstyled
                    {...field}
                    {...textareaProps}
                  />
                );
              }

              const {
                type = "text",
                placeholder = `Enter ${label}`,
                className: inputCn,
                ...inputProps
              } = editorMeta.props ?? {};

              return (
                <Input
                  type={type}
                  placeholder={placeholder}
                  className={cn(
                    fieldState.invalid && "*:text-destructive",
                    inputCn,
                  )}
                  onBlur={() => {
                    form.setValue("value", getCurrentValue());
                    context.setCurrentEdit(null);
                    onBlur();
                  }}
                  unstyled
                  {...field}
                  {...inputProps}
                />
              );
            }}
          />
        </Form>
      )}
    </TableCell>
  );
}

function TableCellEditorNumber({
  context,
  editorMeta,
  className,
  onDoubleClick,
  children,
  ...props
}: TableCellEditorProps<"number">) {
  type FormSchema = z.infer<typeof formSchema>;

  const schema = useMemo(
    () =>
      editorMeta.schema ??
      sharedSchemas.number({ coerce: true, withRequired: true }),
    [editorMeta.schema],
  );

  const getCurrentValue = () => schema.catch(0).parse(context.cellData);
  const isEdit = context.currentEdit?.cellId === context.cellId;

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: getCurrentValue() },
  });

  useEffect(() => {
    if (isEdit) form.setFocus("value");
  }, [form, isEdit]);

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => {
      context.handleCellEdit(formData.value, context);
      context.setCurrentEdit(null);
    },
    (e) => errorToast(e.value?.message),
  );

  const label = context.columnMeta?.label?.toLowerCase() ?? "a number";

  return (
    <TableCell
      onDoubleClick={(e) => {
        onDoubleClick?.(e);
        if (!context.currentEdit) context.setCurrentEdit(context);
      }}
      className={cn(isEdit && "px-0 py-1", className)}
      {...props}
    >
      {!isEdit && children}

      {isEdit && (
        <Form onSubmit={onFormSubmit}>
          <Controller
            name="value"
            control={form.control}
            render={({ field: { onBlur, ...field }, fieldState }) => {
              const {
                type = "number",
                placeholder = `Enter ${label}`,
                className: inputCn,
                ...inputProps
              } = editorMeta.props ?? {};

              return (
                <Input
                  type={type}
                  placeholder={placeholder}
                  className={cn(
                    fieldState.invalid && "*:text-destructive",
                    inputCn,
                  )}
                  onBlur={() => {
                    form.setValue("value", getCurrentValue());
                    context.setCurrentEdit(null);
                    onBlur();
                  }}
                  unstyled
                  {...field}
                  {...inputProps}
                />
              );
            }}
          />
        </Form>
      )}
    </TableCell>
  );
}

function TableCellEditorBoolean({
  context,
  editorMeta,
  className,
  onDoubleClick,
  children,
  ...props
}: TableCellEditorProps<"boolean" | "boolean:switch">) {
  type FormSchema = z.infer<typeof formSchema>;

  const schema = useMemo(
    () => editorMeta.schema ?? sharedSchemas.boolean(),
    [editorMeta.schema],
  );

  const getCurrentValue = () => schema.catch(true).parse(context.cellData);
  const isEdit = context.currentEdit?.cellId === context.cellId;

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: getCurrentValue() },
  });

  useEffect(() => {
    if (isEdit) form.setFocus("value");
  }, [form, isEdit]);

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => {
      context.handleCellEdit(formData.value, context);
      context.setCurrentEdit(null);
    },
    (e) => errorToast(e.value?.message),
  );

  return (
    <TableCell
      onDoubleClick={(e) => {
        onDoubleClick?.(e);
        if (!context.currentEdit) context.setCurrentEdit(context);
      }}
      className={cn(isEdit && TABLE_CELL_CLASS.cellEditPadding, className)}
      {...props}
    >
      {!isEdit && children}

      {isEdit && (
        <Form onSubmit={onFormSubmit}>
          <Controller
            name="value"
            control={form.control}
            render={({ field: { value, onChange, onBlur, ...field } }) => {
              if (editorMeta.type === "boolean") {
                const {
                  onKeyDown,
                  className: checkboxCn,
                  ...checkboxProps
                } = editorMeta.props ?? {};

                return (
                  <Checkbox
                    checked={value}
                    onCheckedChange={onChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onFormSubmit();
                      }

                      onKeyDown?.(e);
                    }}
                    onBlur={() => {
                      onFormSubmit();
                      onBlur();
                    }}
                    className={cn("mx-auto", checkboxCn)}
                    {...field}
                    {...checkboxProps}
                  />
                );
              }

              const {
                onKeyDown,
                className: switchCn,
                ...switchProps
              } = editorMeta.props ?? {};

              return (
                <Switch
                  checked={value}
                  onCheckedChange={onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onFormSubmit();
                    }

                    onKeyDown?.(e);
                  }}
                  onBlur={() => {
                    onFormSubmit();
                    onBlur();
                  }}
                  className={cn("mx-auto", switchCn)}
                  {...field}
                  {...switchProps}
                />
              );
            }}
          />
        </Form>
      )}
    </TableCell>
  );
}
