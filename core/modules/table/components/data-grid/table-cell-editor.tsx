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
  DataGridCellEditOptions,
  DataGridCellEditorMeta,
  DataGridCellEditorType,
  DataGridEditState,
} from "@/core/modules/table/types";
import { sharedSchemas } from "@/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CellData } from "@tanstack/react-table";
import { cn } from "cn";
import { useCallback, useEffect, useMemo } from "react";
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
    exitCell: () => void;
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

  const getCurrentValue = useCallback(
    () => schema.catch("").parse(context.cellData),
    [context.cellData, schema],
  );

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: getCurrentValue() },
  });

  useEffect(() => {
    if (isEdit) return form.setFocus("value");
    form.resetDefaultValues({ value: getCurrentValue() });
    form.reset();
  }, [form, getCurrentValue, isEdit]);

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => context.handleCellEdit(formData.value, context),
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
                      "leading-normal",
                      textareaCn,
                    )}
                    onKeyDown={(e) => {
                      if (e.ctrlKey && e.key === "Enter") {
                        e.preventDefault();
                        onFormSubmit();
                      }
                    }}
                    onBlur={() => {
                      onBlur();
                      if (context.currentEdit) context.setCurrentEdit(null);
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
                    onBlur();
                    if (context.currentEdit) context.setCurrentEdit(null);
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

  const isEdit = context.currentEdit?.cellId === context.cellId;
  const alwaysEditable = editorMeta.alwaysEditable ?? false;

  const schema = useMemo(
    () => editorMeta.schema ?? sharedSchemas.boolean(),
    [editorMeta.schema],
  );

  const getCurrentValue = useCallback(
    () => schema.catch(true).parse(context.cellData),
    [context.cellData, schema],
  );

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: getCurrentValue() },
  });

  useEffect(() => {
    if (isEdit || (alwaysEditable && context.isSelected))
      return form.setFocus("value");

    if (alwaysEditable) return;

    form.resetDefaultValues({ value: getCurrentValue() });
    form.reset();
  }, [
    alwaysEditable,
    context.cellId,
    context.isSelected,
    form,
    getCurrentValue,
    isEdit,
  ]);

  useEffect(() => {
    if (!alwaysEditable || context.isSelected) return;

    const formValue = form.getValues("value");
    const cellValue = getCurrentValue();

    if (!context.isCellEdited && cellValue !== formValue)
      form.setValue("value", cellValue);
  }, [
    alwaysEditable,
    context.isCellEdited,
    context.isSelected,
    form,
    getCurrentValue,
  ]);

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => {
      const { handleCellEdit, exitCell } = context;
      handleCellEdit(formData.value, context, { silent: alwaysEditable });
      if (!alwaysEditable) exitCell();
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
            render={({ field: { value, onChange, onBlur, ...field } }) => {
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
                    onBlur={() => {
                      onBlur();
                      if (context.currentEdit) context.setCurrentEdit(null);
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
                  onBlur={() => {
                    onBlur();
                    if (context.currentEdit) context.setCurrentEdit(null);
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
