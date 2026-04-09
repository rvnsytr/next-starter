"use client";

import { languageMeta } from "@/config/app";
import {
  DateMultiPicker,
  DatePicker,
  DateRangePicker,
} from "@/core/components/features/date-picker";
import { Button, ResetButton } from "@/core/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/core/components/ui/field";
import { Form } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/core/components/ui/number-field";
import { Textarea } from "@/core/components/ui/textarea";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { sharedSchemas } from "@/core/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { SaveIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

type FormSchema = z.infer<typeof formSchema>;
const formSchema = z.object({
  text: sharedSchemas.string({ label: "Name", min: 1 }),
  textarea: sharedSchemas.string({ label: "Description", min: 1, max: 255 }),

  number: sharedSchemas.number({ label: "Quantity", min: 1 }),
  // phone: sharedSchemas.number("Phone field", { min: 1 }),

  date: sharedSchemas.date({ label: "Date field", max: "now" }),
  dateMultiple: sharedSchemas.dateMultiple({
    label: "Available at",
    minDate: 1,
    maxDate: 2,
  }),
  dateRange: sharedSchemas.dateRange({ label: "Schedule" }),

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
  const now = new Date();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "Hello World",
      textarea: "The Brown Fox Jumping Over The Lazy Dog",

      number: 100000,
      //   phone: 81234567890,

      date: now,
      dateMultiple: [now],
      dateRange: { from: now, to: addDays(now, 6) },

      //   select: "spade",
      //   multiSelect: ["spade"],
      //   radio: "spade",

      //   switch: false,
      // checkbox: ["firefox"],

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
    <Form
      onSubmit={form.handleSubmit(formHandler)}
      className="grid sm:grid-cols-2"
    >
      <Controller
        control={form.control}
        name="text"
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Name</FieldLabel>
            <Input
              type="text"
              placeholder="Enter your name"
              required
              {...field}
            />
            <FieldDescription>Visible on your profile</FieldDescription>
            <FieldError match={!!fieldState.error}>
              {fieldState.error?.message}
            </FieldError>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="number"
        render={({ field: { onChange, ...field }, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <NumberField
              defaultValue={0}
              locale={languageMeta.id.locale}
              onValueChange={onChange}
              required
              {...field}
            >
              <NumberFieldScrubArea label="Quantity" />
              <NumberFieldGroup>
                <NumberFieldInput placeholder="Enter quantity" />
                <NumberFieldDecrement />
                <NumberFieldIncrement />
              </NumberFieldGroup>
            </NumberField>

            <FieldError match={!!fieldState.error}>
              {fieldState.error?.message}
            </FieldError>
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="textarea"
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              placeholder="Type your message here"
              required
              {...field}
            />
            <FieldError match={!!fieldState.error}>
              {fieldState.error?.message}
            </FieldError>
          </Field>
        )}
      />

      <Controller
        name="date"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Birth Date</FieldLabel>
            <DatePicker
              id={field.name}
              selected={field.value}
              onSelect={field.onChange}
              required
            />
            <FieldError match={!!fieldState.error}>
              {fieldState.error?.message}
            </FieldError>
          </Field>
        )}
      />

      <Controller
        name="dateMultiple"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Available at</FieldLabel>
            <DateMultiPicker
              id={field.name}
              selected={field.value}
              onSelect={field.onChange}
              className="w-full"
              required
            />
            <FieldError match={!!fieldState.error}>
              {fieldState.error?.message}
            </FieldError>
          </Field>
        )}
      />

      <Controller
        name="dateRange"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Schedule</FieldLabel>
            <DateRangePicker
              id={field.name}
              selected={field.value}
              onSelect={field.onChange}
              className="w-full"
              required
            />
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
