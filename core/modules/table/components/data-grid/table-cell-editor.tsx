import { Form } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { TableCell } from "@/core/components/ui/table";
import { Textarea } from "@/core/components/ui/textarea";
import { toast } from "@/core/components/ui/toast";
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
import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type TableCellEditorControllerProps = React.ComponentProps<typeof TableCell> & {
  context: DataGridCellEditContext & {
    edit: DataGridEditState | null;
    setEdit: React.Dispatch<React.SetStateAction<DataGridEditState | null>>;
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
    case "string:textarea": {
      const editorMeta = context.columnMeta.editor;
      return (
        <TableCellEditorString
          context={context}
          editorMeta={editorMeta}
          {...props}
        />
      );
    }

    default:
      return <TableCell {...props} />;
  }
}

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

  const isEdit = useMemo(
    () => context.edit?.cellId === context.cellId,
    [context.edit, context.cellId],
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
    if (isEdit) form.setFocus("value");
  }, [form, isEdit]);

  const onFormSubmit = form.handleSubmit(
    (formData: FormSchema) => {
      context.handleCellEdit(formData.value, context);
      context.setEdit(null);
    },
    (e) => errorToast(e.value?.message),
  );

  const label = context.columnMeta?.label?.toLowerCase() ?? "a value";

  return (
    <TableCell
      onDoubleClick={(e) => {
        onDoubleClick?.(e);
        if (!context.edit) context.setEdit(context);
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
                      onBlur();
                      form.setValue("value", getCurrentValue());
                      context.setEdit(null);
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
                    onBlur();
                    form.setValue("value", getCurrentValue());
                    context.setEdit(null);
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
