import { CustomColorBadge } from "@/core/components/ui/badge";
import { Checkbox } from "@/core/components/ui/checkbox";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxValue,
} from "@/core/components/ui/combobox";
import { Form } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Switch } from "@/core/components/ui/switch";
import { TableCell } from "@/core/components/ui/table";
import { Textarea } from "@/core/components/ui/textarea";
import { toast } from "@/core/components/ui/toast";
import { TABLE_CELL_CLASS } from "@/core/modules/table/constants";
import {
  ColumnValueOption,
  DataGridCellEditContext,
  DataGridCellEditOptions,
  DataGridCellEditorMeta,
  DataGridCellEditorType,
  DataGridEditState,
} from "@/core/modules/table/types";
import { isEqual } from "@/core/utils";
import { sharedSchemas } from "@/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CellData } from "@tanstack/react-table";
import { cn } from "cn";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
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

    exitCellEdit: () => void;
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
    case "multi-option":
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

  const currentCellValue = useMemo(
    () => schema.catch("").parse(context.cellData),
    [context.cellData, schema],
  );

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: currentCellValue },
  });

  useEffect(() => {
    if (isEdit) return form.setFocus("value");
    form.resetDefaultValues({ value: currentCellValue });
    form.reset();
  }, [form, currentCellValue, isEdit]);

  const onFormSubmit = form.handleSubmit(
    ({ value }: FormSchema) => {
      if (value === currentCellValue) return context.exitCellEdit();
      context.handleCellEdit(value, context);
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
                  onKeyDown,
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

                      onKeyDown?.(e);
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

  const currentCellValue = useMemo(
    () => schema.catch(true).parse(context.cellData),
    [context.cellData, schema],
  );

  const formSchema = z.object({ value: schema });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: currentCellValue },
  });

  useEffect(() => {
    if (isEdit || (alwaysEditable && context.isSelected))
      return form.setFocus("value");

    if (alwaysEditable) {
      const formValue = form.getValues("value");

      if (!context.isCellEdited && currentCellValue !== formValue) {
        form.resetDefaultValues({ value: currentCellValue });
        form.reset();
      }

      return;
    }

    form.resetDefaultValues({ value: currentCellValue });
    form.reset();
  }, [
    alwaysEditable,
    context.isCellEdited,
    context.isSelected,
    currentCellValue,
    form,
    isEdit,
  ]);

  const onFormSubmit = form.handleSubmit(
    ({ value }: FormSchema) => {
      if (!alwaysEditable && value === currentCellValue)
        return context.exitCellEdit();
      context.handleCellEdit(value, context, { silent: alwaysEditable });
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

type ColumnItem = ColumnValueOption & { createItem?: boolean };

function TableCellEditorOption({
  context,
  editorMeta,
  className,
  onMouseDown,
  onMouseEnter,
  onDoubleClick,
  children,
  ...props
}: TableCellEditorProps<"option" | "multi-option">) {
  type FormSchema = z.infer<typeof formSchema>;

  const [createableItems, setCreateableItems] = useState<ColumnItem[]>([]);

  const isEdit = context.currentEdit?.cellId === context.cellId;

  const config = useMemo(() => {
    const baseSchema = sharedSchemas.string({ withRequired: true });

    if (editorMeta.type === "option")
      return {
        multiple: false as const,
        schema: editorMeta.schema ?? baseSchema,
      };

    return {
      multiple: true as const,
      schema: editorMeta.schema ?? baseSchema.array(),
    };
  }, [editorMeta.schema, editorMeta.type]);

  const currentCellValue = useMemo(() => {
    if (config.multiple) return config.schema.catch([]).parse(context.cellData);
    return config.schema.catch("").parse(context.cellData);
  }, [config.multiple, config.schema, context.cellData]);

  const formSchema = z.object({ value: config.schema, query: z.string() });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: currentCellValue,
      query: typeof currentCellValue === "string" ? currentCellValue : "",
    },
  });

  const query = useWatch({ control: form.control, name: "query" });

  useEffect(() => {
    if (isEdit) return form.setFocus("value");
    form.resetDefaultValues({
      value: currentCellValue,
      query: typeof currentCellValue === "string" ? currentCellValue : "",
    });
    form.reset();
  }, [context.isCellEdited, currentCellValue, form, isEdit]);

  const onFormSubmit = form.handleSubmit(
    ({ value }: FormSchema) => {
      const submittedValues = new Set(
        (Array.isArray(value) ? value : [value]).map((v) => v.toLowerCase()),
      );

      setCreateableItems((items) =>
        items.filter((item) => submittedValues.has(item.value.toLowerCase())),
      );

      if (isEqual(value, currentCellValue)) return context.exitCellEdit();
      context.handleCellEdit(value, context);
    },
    (e) => errorToast(e.value?.message),
  );

  const baseItems = useMemo(
    () => [
      ...(context.columnMeta?.options ?? []),
      ...(editorMeta.createable ? createableItems : []),
    ],
    [context.columnMeta?.options, createableItems, editorMeta.createable],
  );

  const findItem = useCallback(
    (key: string) =>
      baseItems.find((item) => item.value.toLowerCase() === key.toLowerCase()),
    [baseItems],
  );

  const columnItems: ColumnItem[] = useMemo(() => {
    const items = baseItems.sort((a, b) => {
      if (a.value < b.value) return -1;
      if (a.value > b.value) return 1;
      return 0;
    });

    const itemsMap = new Map(
      items.map((item) => [item.value.toLowerCase(), item]),
    );

    const itemsArr = Array.from(itemsMap.values());

    const createItem: ColumnItem = {
      value: query,
      label: `Create "${query}"`,
      icon: PlusIcon,
      createItem: true,
    };

    const withCreateItem =
      editorMeta.createable && query && !itemsMap.has(query.toLowerCase());

    return withCreateItem ? [...itemsArr, createItem] : itemsArr;
  }, [baseItems, editorMeta.createable, query]);

  const {
    placeholder = `Select ${config.multiple ? "some" : "an"} item...`,
    onKeyDown,
    ...restInputProps
  } = editorMeta.inputProps ?? {};

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
      onDoubleClick={(e) => {
        onDoubleClick?.(e);
        if (!context.currentEdit) context.setCurrentEdit(context);
      }}
      className={cn(
        isEdit && !config.multiple && TABLE_CELL_CLASS.cellEditPadding,
        className,
      )}
      {...props}
    >
      {!isEdit && children}

      {isEdit && (
        <Form onSubmit={onFormSubmit}>
          <Controller
            name="value"
            control={form.control}
            render={({ field: { value, onChange, ...field } }) => (
              <Controller
                name="query"
                control={form.control}
                render={({ field: { onChange: onQueryChange } }) => (
                  <Combobox
                    items={columnItems}
                    value={value}
                    onValueChange={(newValue) => {
                      if (editorMeta.createable && newValue) {
                        const itemsMap = new Map(
                          columnItems
                            .filter((v) => !v.createItem)
                            .map((v) => [v.value.toLowerCase(), v]),
                        );

                        const newValues = Array.isArray(newValue)
                          ? newValue
                          : [newValue];

                        const newItems = newValues
                          .filter((v) => !itemsMap.has(v.toLowerCase()))
                          .map((v) => ({ value: v.toLowerCase(), label: v }));

                        if (newItems.length) {
                          setCreateableItems((prev) => {
                            const existing = new Set(
                              prev.map((item) => item.value.toLowerCase()),
                            );

                            return [
                              ...prev,
                              ...newItems.filter(
                                (item) => !existing.has(item.value),
                              ),
                            ];
                          });
                        }
                      }

                      onChange(newValue);
                    }}
                    multiple={config.multiple}
                    inputValue={findItem(query)?.label ?? query}
                    onInputValueChange={onQueryChange}
                    {...editorMeta.props}
                  >
                    {config.multiple ? (
                      <ComboboxChips unstyled>
                        <ComboboxValue>
                          {(items: string[]) => (
                            <>
                              {items.map((item) => {
                                const selected = findItem(item);

                                if (selected?.color)
                                  return (
                                    <ComboboxChip
                                      key={item}
                                      render={
                                        <CustomColorBadge
                                          color={selected.color}
                                        >
                                          {selected.label}
                                        </CustomColorBadge>
                                      }
                                    />
                                  );

                                return (
                                  <ComboboxChip key={item}>{item}</ComboboxChip>
                                );
                              })}

                              <ComboboxChipsInput
                                placeholder={placeholder}
                                onKeyDown={(e) => {
                                  if (e.ctrlKey && e.key === "Enter") {
                                    e.preventDefault();
                                    onFormSubmit();
                                  }

                                  onKeyDown?.(e);
                                }}
                                {...field}
                                {...restInputProps}
                              />
                            </>
                          )}
                        </ComboboxValue>
                      </ComboboxChips>
                    ) : (
                      <ComboboxInput
                        inputGroupProps={{ unstyled: true }}
                        placeholder={placeholder}
                        onKeyDown={(e) => {
                          if (e.ctrlKey && e.key === "Enter") {
                            e.preventDefault();
                            onFormSubmit();
                          }

                          onKeyDown?.(e);
                        }}
                        {...field}
                        {...restInputProps}
                      />
                    )}

                    <ComboboxPopup {...editorMeta.popupProps}>
                      <ComboboxEmpty>No items found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item: (typeof columnItems)[number]) => {
                          const Icon = item.icon;

                          const Content = (
                            <div className="flex items-center gap-2">
                              {Icon && <Icon />}
                              {item.label}
                            </div>
                          );

                          if (item.createItem) {
                            return (
                              <ComboboxItem
                                key={item.value}
                                value={item.value}
                                render={Content}
                              />
                            );
                          }

                          return (
                            <ComboboxItem key={item.value} value={item.value}>
                              {Content}
                            </ComboboxItem>
                          );
                        }}
                      </ComboboxList>
                    </ComboboxPopup>
                  </Combobox>
                )}
              />
            )}
          />
        </Form>
      )}
    </TableCell>
  );
}
