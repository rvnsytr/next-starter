import { Form } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { DEFAULT_CELL_EDITOR_TYPE } from "@/core/modules/table/constants";
import { DataGridCellEditorMeta } from "@/core/modules/table/types";
import { ErrorFallback } from "@/shared/components/fallback";
import { sharedSchemas } from "@/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CellData } from "@tanstack/react-table";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export type CellEditorControllerProps = {
  meta?: DataGridCellEditorMeta;
  onSubmit: (data: CellData) => void;
};

export function CellEditorController(props: CellEditorControllerProps) {
  const editorType: DataGridCellEditorMeta["type"] =
    props.meta?.type ?? DEFAULT_CELL_EDITOR_TYPE;

  switch (editorType) {
    case "string":
      return <CellEditorControllerString {...props} />;
    default: {
      return (
        <ErrorFallback
          error={`Unsupported Editor Type: ${editorType}`}
          className="rounded-none border-none"
          hideCode
          hideError
        />
      );
    }
  }
}

export function CellEditorControllerString({
  onSubmit,
}: CellEditorControllerProps) {
  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = z.object({ string: sharedSchemas.string() });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { string: "" },
  });

  const onFormSubmit = (formData: FormSchema) => onSubmit(formData.string);

  return (
    <Form onSubmit={form.handleSubmit(onFormSubmit)}>
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
