import { Checkbox } from "@/core/components/ui/checkbox";
import { Form } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import {
  Menu,
  MenuCheckboxItem,
  MenuPopup,
  MenuTrigger,
} from "@/core/components/ui/menu";
import { Switch } from "@/core/components/ui/switch";
import { Textarea } from "@/core/components/ui/textarea";
import { toast } from "@/core/components/ui/toast";
import {
  ColumnMeta,
  DataGridCellEditorMeta,
  DataGridCellEditorType,
} from "@/core/modules/table/types";
import { Override } from "@/core/types";
import { ErrorFallback } from "@/shared/components/fallback";
import { sharedSchemas } from "@/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CellData } from "@tanstack/react-table";
import { cn } from "cn";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type CellEditorControllerProps = {
  columnMeta?: ColumnMeta;
  editorMeta: DataGridCellEditorMeta;
  defaultValue?: CellData;
  edit: boolean;
  render: React.ReactNode;
  onSubmit: (data: CellData) => void;
};

function errorToast(errorMessage?: string) {
  const title = "Invalid value";
  const description = errorMessage ?? "Please enter a valid value.";
  toast.add({ type: "error", title, description });
}

export function CellEditorController({
  editorMeta,

  render,
  ...props
}: CellEditorControllerProps) {
  const editorType = editorMeta.type;

  switch (editorType) {
    case "string":
    case "string:textarea":
      return (
        <StringCellEditor editorMeta={editorMeta} render={render} {...props} />
      );

    case "number":
      return (
        <NumberCellEditor editorMeta={editorMeta} render={render} {...props} />
      );

    case "boolean":
    case "boolean:switch":
      return (
        <BooleanCellEditor editorMeta={editorMeta} render={render} {...props} />
      );

    case "option":
      return (
        <OptionCellEditor editorMeta={editorMeta} render={render} {...props} />
      );

    default: {
      return (
        <ErrorFallback
          error={`Editor type "${editorType}" is not supported.`}
          className="rounded-none border-none"
          errorOnly
          hideCode
        />
      );
    }
  }
}

type CellEditorProps<T extends DataGridCellEditorType> = Override<
  CellEditorControllerProps,
  { editorMeta: Extract<DataGridCellEditorMeta, { type: T }> }
>;

function StringCellEditor({
  columnMeta,
  editorMeta,
  defaultValue: dv,
  edit,
  render,
  onSubmit,
}: CellEditorProps<"string" | "string:textarea">) {
  type FormSchema = z.infer<typeof formSchema>;

  const schema =
    editorMeta.schema ?? sharedSchemas.string({ withRequired: true });
  const defaultValue = schema.catch("").parse(dv);

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: defaultValue },
  });

  useEffect(() => form.setFocus("value"), [form, edit]);

  if (!edit) return render;

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => onSubmit(formData.value),
    (e) => errorToast(e.value?.message),
  );

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
  edit,
  render,
  onSubmit,
}: CellEditorProps<"number">) {
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

  useEffect(() => form.setFocus("value"), [form, edit]);

  if (!edit) return render;

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => onSubmit(formData.value),
    (e) => errorToast(e.value?.message),
  );

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
  edit,
  render,
  onSubmit,
}: CellEditorProps<"boolean" | "boolean:switch">) {
  type FormSchema = z.infer<typeof formSchema>;

  const schema = editorMeta.schema ?? sharedSchemas.boolean();
  const defaultValue = schema.catch(true).parse(dv);

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: defaultValue },
  });

  useEffect(() => form.setFocus("value"), [form, edit]);

  if (!edit) return render;

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

function OptionCellEditor({
  columnMeta,
  editorMeta,
  defaultValue: dv,
  edit,
  render,
  onSubmit,
}: CellEditorProps<"option">) {
  type FormSchema = z.infer<typeof formSchema>;

  const schema =
    editorMeta.schema ??
    sharedSchemas.string({ coerce: true, withRequired: true });
  const defaultValue = schema.catch("").parse(dv);

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: defaultValue },
  });

  useEffect(() => form.setFocus("value"), [form, edit]);

  const items = useMemo(() => {
    if (!columnMeta?.options || !columnMeta.options.length) return [];
    return columnMeta.options.sort((a, b) => {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    });
  }, [columnMeta]);

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => onSubmit(formData.value),
    (e) => errorToast(e.value?.message),
  );

  if (!items.length)
    return (
      <ErrorFallback
        error="No option items provided for this column"
        errorOnly
        hideCode
      />
    );

  return (
    <Form onSubmit={onFormSubmit}>
      <Controller
        name="value"
        control={form.control}
        render={({ field: { value, onChange } }) => (
          <Menu
          // open={edit}
          // onOpenChange={(v) => {
          //   if (!v) onFormSubmit();
          // }}
          >
            <MenuTrigger>{render}</MenuTrigger>

            <MenuPopup align="center">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <MenuCheckboxItem
                    key={item.value}
                    checked={value === item.value}
                    onCheckedChange={() => onSubmit(item.value)}
                  >
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="text-muted-foreground" />}
                      {item.label}
                    </div>
                  </MenuCheckboxItem>
                );
              })}
            </MenuPopup>
          </Menu>
        )}
      />
    </Form>
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
      context.exitCell();
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
  onMouseDown,
  onMouseEnter,
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
  const alwaysEditable = editorMeta.alwaysEditable ?? false;

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
      onMouseDown={(e) => {
        if (!alwaysEditable) return onMouseDown?.(e);
        if (isInteractiveTarget(e.target)) return;
        onMouseDown?.(e);
      }}
      onMouseEnter={(e) => {
        if (!alwaysEditable) return onMouseEnter?.(e);
        if (isInteractiveTarget(e.target)) return;
        onMouseEnter?.(e);
      }}
      onDoubleClick={(e) => {
        if (alwaysEditable) return;
        onDoubleClick?.(e);
        if (!context.currentEdit) context.setCurrentEdit(context);
      }}
      className={cn(isEdit && TABLE_CELL_CLASS.cellEditPadding, className)}
      {...props}
    >
      {!isEdit && !alwaysEditable && children}

      {(isEdit || alwaysEditable) && (
        <Form onSubmit={onFormSubmit}>
          <Controller
            name="value"
            control={form.control}
            render={({ field: { value, onChange, ...field } }) => {
              if (editorMeta.type === "boolean") {
                const {
                  onKeyDown,
                  className: checkboxCn,
                  ...checkboxProps
                } = editorMeta.props ?? {};

                return (
                  <Checkbox
                    checked={value}
                    onCheckedChange={(e) => {
                      onChange(e);
                      if (alwaysEditable) onFormSubmit();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onFormSubmit();
                      }

                      onKeyDown?.(e);
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
                  onCheckedChange={(e) => {
                    onChange(e);
                    if (alwaysEditable) onFormSubmit();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onFormSubmit();
                    }

                    onKeyDown?.(e);
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
