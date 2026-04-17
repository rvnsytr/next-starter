"use client";

import {
  DateMultiPicker,
  DatePicker,
  DateRangePicker,
} from "@/core/components/date-picker";
import { FileUpload } from "@/core/components/file-upload";
import { PasswordInput } from "@/core/components/password-input";
import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
} from "@/core/components/ui/autocomplete";
import { Button, ResetButton } from "@/core/components/ui/button";
import { Checkbox } from "@/core/components/ui/checkbox";
import { CheckboxGroup } from "@/core/components/ui/checkbox-group";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxValue,
} from "@/core/components/ui/combobox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/core/components/ui/field";
import { Form } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/core/components/ui/number-field";
import { RadioGroup, RadioGroupItem } from "@/core/components/ui/radio-group";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Switch } from "@/core/components/ui/switch";
import { Textarea } from "@/core/components/ui/textarea";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { sharedSchemas } from "@/core/schema";
import { toBytes } from "@/core/utils";
import { languageConfig } from "@/shared/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { SaveIcon, SearchIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Grape", value: "grape" },
  { label: "Strawberry", value: "strawberry" },
  { label: "Mango", value: "mango" },
  { label: "Pineapple", value: "pineapple" },
  { label: "Kiwi", value: "kiwi" },
  { label: "Peach", value: "peach" },
  { label: "Pear", value: "pear" },
] as const;
const fruitsArr = fruits.map((f) => f.value);

type FormSchema = z.infer<typeof formSchema>;
const formSchema = z.object({
  text: sharedSchemas.string({ label: "Name", min: 1 }),
  textarea: sharedSchemas.string({ label: "Description", min: 1, max: 255 }),

  number: sharedSchemas.number({ label: "Quantity", min: 1 }),
  // phone: sharedSchemas.number("Phone field", { min: 1 }),

  date: sharedSchemas.date({
    label: "Date field",
    max: addDays(new Date(), 1),
  }),
  dateMultiple: sharedSchemas.dateMultiple({
    label: "Available at",
    minDate: 1,
    maxDate: 2,
  }),
  dateRange: sharedSchemas.dateRange({ label: "Schedule" }),

  autocomplete: sharedSchemas.string({ label: "Search", min: 1 }),
  combobox: z
    .object({ label: z.string(), value: z.enum(fruitsArr) })
    .array()
    .min(1),
  select: z
    .object({ label: z.string(), value: z.enum(fruitsArr) })
    .array()
    .min(1),

  radio: z.enum(fruitsArr),
  checkbox: z.array(z.enum(fruitsArr)).refine((v) => v.some((i) => i)),
  switch: z.boolean(),

  password: sharedSchemas.password,
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

      autocomplete: fruits[0].label,
      combobox: [fruits[0]],
      select: [fruits[0]],

      radio: fruits[0].value,
      checkbox: [fruitsArr[0]],
      switch: false,

      password: "Example#123",
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
      className="*:gap-x-2 *:gap-y-4"
    >
      <div className="grid sm:grid-cols-2">
        <Controller
          name="text"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <FieldLabel>Input Field</FieldLabel>
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
          name="number"
          control={form.control}
          render={({ field: { onChange, ...field }, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <NumberField
                defaultValue={0}
                locale={languageConfig.id.locale}
                onValueChange={onChange}
                required
                {...field}
              >
                <NumberFieldScrubArea label="Number Field" />
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
          name="textarea"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <FieldLabel>Textarea</FieldLabel>
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
              <FieldLabel>Date Picker</FieldLabel>
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
              <FieldLabel>Multi Date</FieldLabel>
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
              <FieldLabel>Date Range</FieldLabel>
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
      </div>

      <div className="grid sm:grid-cols-3">
        <Controller
          name="autocomplete"
          control={form.control}
          render={({ field: { onChange, ...field }, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <FieldLabel>Autocomplete</FieldLabel>

              <Autocomplete
                items={fruits}
                onValueChange={onChange}
                autoHighlight
                {...field}
              >
                <AutocompleteInput
                  placeholder="Search fruits..."
                  showClear
                  showTrigger
                />
                <AutocompletePopup>
                  <AutocompleteEmpty>{messages.empty}</AutocompleteEmpty>
                  <AutocompleteList>
                    {(item: (typeof fruits)[number]) => (
                      <AutocompleteItem key={item.value} value={item}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </AutocompleteList>
                </AutocompletePopup>
              </Autocomplete>

              <FieldError match={!!fieldState.error}>
                {fieldState.error?.message}
              </FieldError>
            </Field>
          )}
        />

        <Controller
          name="combobox"
          control={form.control}
          render={({ field: { onChange, ...field }, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <FieldLabel>Combobox</FieldLabel>

              <Combobox
                items={fruits}
                onValueChange={onChange}
                isItemEqualToValue={(a, b) => a.value === b.value}
                autoHighlight
                multiple
                {...field}
              >
                <ComboboxChips startAddon={<SearchIcon />}>
                  <ComboboxValue>
                    {(items: typeof fruits) => (
                      <>
                        {items.map((item) => (
                          <ComboboxChip key={item.value}>
                            {item.label}
                          </ComboboxChip>
                        ))}

                        <ComboboxChipsInput
                          placeholder={
                            items.length > 0 ? undefined : "Select fruits..."
                          }
                        />
                      </>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxPopup>
                  <ComboboxEmpty>{messages.empty}</ComboboxEmpty>
                  <ComboboxList>
                    {(item: (typeof fruits)[number]) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxPopup>
              </Combobox>

              <FieldError match={!!fieldState.error}>
                {fieldState.error?.message}
              </FieldError>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="select"
          render={({ field: { onChange, ...field }, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <FieldLabel>Select</FieldLabel>

              <Select
                items={fruits}
                onValueChange={onChange}
                isItemEqualToValue={(a, b) => a.value === b.value}
                multiple
                {...field}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectPopup>
                  {fruits.map((item) => (
                    <SelectItem key={item.value} value={item}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>

              <FieldError match={!!fieldState.error}>
                {fieldState.error?.message}
              </FieldError>
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-3">
        <Controller
          control={form.control}
          name="radio"
          render={({ field: { onChange, ...field }, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <FieldLabel>Radio Group</FieldLabel>

              <RadioGroup onValueChange={onChange} {...field}>
                {fruits.map((item) => (
                  <Label key={item.value}>
                    <RadioGroupItem value={item.value} /> {item.label}
                  </Label>
                ))}
              </RadioGroup>

              <FieldError match={!!fieldState.error}>
                {fieldState.error?.message}
              </FieldError>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="checkbox"
          render={({ field: { onChange, ...field }, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <FieldLabel>Checkbox Group</FieldLabel>

              <CheckboxGroup onValueChange={onChange} {...field}>
                {fruits.map((item) => (
                  <Label key={item.value}>
                    <Checkbox value={item.value} /> {item.label}
                  </Label>
                ))}
              </CheckboxGroup>

              <FieldError match={!!fieldState.error}>
                {fieldState.error?.message}
              </FieldError>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="switch"
          render={({ field: { value, onChange, ...field }, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <FieldLabel>Switch</FieldLabel>

              <Switch checked={value} onCheckedChange={onChange} {...field} />

              <FieldError match={!!fieldState.error}>
                {fieldState.error?.message}
              </FieldError>
            </Field>
          )}
        />
      </div>

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Password Input</FieldLabel>
            <PasswordInput
              placeholder="Enter your password"
              required
              withValidationList
              {...field}
            />
            <FieldError match={!!fieldState.error}>
              {fieldState.error?.message}
            </FieldError>
          </Field>
        )}
      />

      <Field>
        <FieldLabel>File Upload</FieldLabel>
        {/* <FileUpload {...fileTypeConfig.audio} maxFiles={2} /> */}
        <FileUpload maxSize={toBytes(1)} multiple sortable />
      </Field>

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
