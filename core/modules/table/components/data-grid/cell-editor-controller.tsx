import { Form } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { toast } from "@/core/components/ui/toast";
import {
  DataGridCellEditorMeta,
  DataGridCellEditorType,
} from "@/core/modules/table/types";
import { Override } from "@/core/types";
import { ErrorFallback } from "@/shared/components/fallback";
import { sharedSchemas } from "@/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CellData } from "@tanstack/react-table";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type CellEditorControllerProps = {
  meta: DataGridCellEditorMeta;
  defaultValue?: CellData;
  onSubmit: (data: CellData) => void;
};

export function CellEditorController({
  meta,
  ...props
}: CellEditorControllerProps) {
  switch (meta?.type) {
    case "string":
      return <StringCellEditor meta={meta} {...props} />;
    default: {
      return (
        <ErrorFallback
          error={`Unsupported Editor Type: ${meta?.type}`}
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
  { meta: Extract<DataGridCellEditorMeta, { type: T }> }
>;

export function StringCellEditor({
  meta,
  defaultValue: dv,
  onSubmit,
}: CellEditorMeta<"string">) {
  type FormSchema = z.infer<typeof formSchema>;

  const schema = meta?.schema ?? sharedSchemas.string();
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

  return (
    <Form onSubmit={onFormSubmit}>
      <Controller
        name="string"
        control={form.control}
        render={({ field }) => (
          <Input placeholder="Enter your name" unstyled autoFocus {...field} />
        )}
      />
    </Form>
  );
}
