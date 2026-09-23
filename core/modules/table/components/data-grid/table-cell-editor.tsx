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
import { TableCell } from "@/core/components/ui/table";
import { Textarea } from "@/core/components/ui/textarea";
import { toast } from "@/core/components/ui/toast";
import { TABLE_CELL_CLASS } from "@/core/modules/table/constants";
import {
  DataGridCellEditContext,
  DataGridCellEditOptions,
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

const interactiveTargetSelector = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "[role=button]",
  '[data-slot="checkbox"]',
  '[data-slot="switch"]',
  "[data-grid-interactive]",
].join(", ");

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element && !!target.closest(interactiveTargetSelector)
  );
}

function errorToast(errorMessage?: string) {
  const title = "Invalid value";
  const description = errorMessage ?? "Please enter a valid value.";
  toast.add({ type: "error", title, description });
}

type TableCellEditorControllerProps = React.ComponentProps<typeof TableCell> & {
  context: DataGridCellEditContext & {
    isSelected: boolean;
    isFocused: boolean;
    isCellEdited: boolean;

    currentEdit: DataGridEditState | null;
    setCurrentEdit: React.Dispatch<
      React.SetStateAction<DataGridEditState | null>
    >;
    handleCellEdit: (
      newValue: CellData,
      context: DataGridCellEditContext,
      options?: DataGridCellEditOptions,
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

    // case "number":
    //   return (
    //     <TableCellEditorNumber
    //       context={context}
    //       editorMeta={context.columnMeta.editor}
    //       {...props}
    //     />
    //   );

    case "boolean":
    case "boolean:switch":
      return (
        <TableCellEditorBoolean
          context={context}
          editorMeta={context.columnMeta.editor}
          {...props}
        />
      );

    case "option":
      return (
        <TableCellEditorOption
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

  const isEdit = context.currentEdit?.cellId === context.cellId;

  const schema = useMemo(
    () => editorMeta.schema ?? sharedSchemas.string({ withRequired: true }),
    [editorMeta.schema],
  );

  const currentValue = useMemo(
    () => schema.catch("").parse(context.cellData),
    [context.cellData, schema],
  );

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: currentValue },
  });

  useEffect(() => {
    if (isEdit) return form.setFocus("value");
    form.resetDefaultValues({ value: currentValue });
    form.reset();
  }, [form, currentValue, isEdit]);

  const onFormSubmit = form.handleSubmit(
    ({ value }: FormSchema) => context.handleCellEdit(value, context),
    (e) => errorToast(e.value?.message),
  );

  const label = context.columnMeta?.label?.toLowerCase() ?? "a value";

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
            render={({ field, fieldState }) => {
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
                      "leading-normal",
                      textareaCn,
                    )}
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

  const isEdit = context.currentEdit?.cellId === context.cellId;
  const alwaysEditable = editorMeta.alwaysEditable ?? false;

  const schema = useMemo(
    () => editorMeta.schema ?? sharedSchemas.boolean(),
    [editorMeta.schema],
  );

  const currentValue = useMemo(
    () => schema.catch(true).parse(context.cellData),
    [context.cellData, schema],
  );

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: currentValue },
  });

  useEffect(() => {
    if (isEdit || (alwaysEditable && context.isSelected))
      return form.setFocus("value");

    if (alwaysEditable) {
      const formValue = form.getValues("value");

      if (!context.isCellEdited && currentValue !== formValue)
        form.setValue("value", currentValue);

      return;
    }

    form.resetDefaultValues({ value: currentValue });
    form.reset();
  }, [
    alwaysEditable,
    context.isCellEdited,
    context.isSelected,
    currentValue,
    form,
    isEdit,
  ]);

  const onFormSubmit = form.handleSubmit(
    ({ value }: FormSchema) =>
      context.handleCellEdit(value, context, { silent: alwaysEditable }),
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
      className={cn(
        isEdit && TABLE_CELL_CLASS.cellEditPadding,
        alwaysEditable && context.isSelected && "cell-edge",
        className,
      )}
      {...props}
    >
      {!isEdit && !alwaysEditable && children}

      {(isEdit || alwaysEditable) && (
        <Form onSubmit={onFormSubmit}>
          <Controller
            name="value"
            control={form.control}
            render={({ field: { value, onChange, ...field } }) => {
              if (editorMeta.type === "boolean:switch") {
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
                    className={cn("mx-auto", switchCn)}
                    {...field}
                    {...switchProps}
                  />
                );
              }

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
            }}
          />
        </Form>
      )}
    </TableCell>
  );
}

function TableCellEditorOption({
  context,
  editorMeta,
  className,
  onMouseDown,
  onMouseEnter,
  children,
  ...props
}: TableCellEditorProps<"option">) {
  type FormSchema = z.infer<typeof formSchema>;

  const isEdit = context.currentEdit?.cellId === context.cellId;

  const schema = useMemo(
    () => editorMeta.schema ?? sharedSchemas.string({ withRequired: true }),
    [editorMeta.schema],
  );

  const currentValue = useMemo(
    () => schema.catch("").parse(context.cellData),
    [context.cellData, schema],
  );

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: currentValue },
  });

  const items = useMemo(() => {
    if (!context.columnMeta?.options || !context.columnMeta.options.length)
      return [];

    return context.columnMeta.options.sort((a, b) => {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    });
  }, [context.columnMeta]);

  useEffect(() => {
    if (!context.isCellEdited) {
      const formValue = form.getValues("value");
      if (currentValue !== formValue) form.setValue("value", currentValue);
    }
  }, [context.isCellEdited, currentValue, form]);

  const onFormSubmit = form.handleSubmit(
    ({ value }: FormSchema) => context.handleCellEdit(value, context),
    (e) => errorToast(e.value?.message),
  );

  return (
    <TableCell
      onMouseDown={(e) => {
        if (isInteractiveTarget(e.target)) return;
        onMouseDown?.(e);
      }}
      onMouseEnter={(e) => {
        if (isInteractiveTarget(e.target)) return;
        onMouseEnter?.(e);
      }}
      className={cn(isEdit && TABLE_CELL_CLASS.cellEditPadding, className)}
      {...props}
    >
      <Form onSubmit={onFormSubmit}>
        <Controller
          name="value"
          control={form.control}
          render={({ field: { value, onChange } }) => (
            <Menu
              open={isEdit}
              onOpenChange={(v) => {
                if (v && !context.currentEdit) context.setCurrentEdit(context);
                else if (!v && context.currentEdit)
                  context.setCurrentEdit(null);
              }}
            >
              <MenuTrigger>{children}</MenuTrigger>

              <MenuPopup>
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <MenuCheckboxItem
                      key={item.value}
                      checked={value === item.value}
                      onCheckedChange={() => {
                        onChange(item.value);
                        if (item.value !== currentValue) onFormSubmit();
                      }}
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
    </TableCell>
  );
}
