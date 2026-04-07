"use client";

import { Button, ResetButton } from "@/core/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/core/components/ui/field";
import { Form } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { sharedSchemas } from "@/core/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

type FormSchema = z.infer<typeof formSchema>;
const formSchema = z.object({
  text: sharedSchemas.string({ label: "Text field", min: 10 }),
  textarea: sharedSchemas.string({ label: "Text Area", min: 1, max: 255 }),

  // number: sharedSchemas.number("Number field", { min: 1 }),
  // phone: sharedSchemas.number("Phone field", { min: 1 }),

  // date: sharedSchemas.date("Date field"),
  // dateMultiple: sharedSchemas.dateMultiple("Multi date field", { min: 1 }),
  // dateRange: sharedSchemas.dateRange,

  // select: z.enum(card),
  // multiSelect: z.array(z.enum(card)).min(1),
  // radio: z.enum(card),

  // switch: z.boolean(),
  // checkbox: z.array(z.enum(checkboxData)).refine((v) => v.some((i) => i), {
  //   error: "At least one checkbox must be selected",
  // }),

  // files: sharedSchemas.files(fileType, {
  // min: 1,
  // max: 5,
  // maxFileSize: toBytes(1),
  // }),
});

export function FormExample() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      textarea: "The Brown Fox Jumping Over The Lazy Dog",

      //   number: 100000,
      //   phone: 81234567890,

      //   date: now,
      //   dateMultiple: [now],
      //   dateRange: { from: now, to: addDays(now, 6) },

      //   select: "spade",
      //   multiSelect: ["spade"],
      //   radio: "spade",

      //   switch: false,
      //   checkbox: ["firefox"],

      //   files: [],
    },
  });

  const formHandler = (formData: FormSchema) => {
    console.log(formData);

    // const res = await uploadFiles({ files: formData.file });
    toast.add({
      type: "success",
      title: messages.success,
      description: (
        <span className="whitespace-pre">
          {JSON.stringify(formData, null, 2)}
        </span>
      ),
    });
  };

  return (
    <Form onSubmit={form.handleSubmit(formHandler)}>
      <Controller
        control={form.control}
        name="text"
        render={({ field, fieldState }) => (
          <Field name="text" invalid={fieldState.invalid}>
            <FieldLabel>Name</FieldLabel>
            <Input type="text" placeholder="Enter your name" {...field} />
            <FieldDescription>Visible on your profile</FieldDescription>
            <FieldError match={!!fieldState.error}>
              {fieldState.error?.message}
            </FieldError>
          </Field>
        )}
      />

      <div className="flex gap-2">
        <Button type="submit">
          {/* <LoadingSpinner loading={isLoading} icon={{ base: <SaveIcon /> }} /> */}
          <SaveIcon /> {messages.actions.save}
        </Button>
        <ResetButton onClick={() => form.reset()} />
      </div>
    </Form>
  );
}
