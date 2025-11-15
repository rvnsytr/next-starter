"use client";

import { FileType, messages } from "@/constants";
import { zodSchemas } from "@/lib/zod";
import { formatDate, formatNumber, formatPhone, sanitizeNumber } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { Club, Diamond, Heart, Save, Spade, TextIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { ResetButton } from "../ui/buttons";
import { Checkbox } from "../ui/checkbox";
import { DatePicker } from "../ui/date-picker";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import { FieldWrapper } from "../ui/field-wrapper";
import { FileUpload } from "../ui/file-upload";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { MultiSelect } from "../ui/multi-select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
// import { uploadFiles } from "@/server/s3";

const card = ["spade", "heart", "diamond", "club"] as const;
const selectAndRadioData = [
  {
    value: "spade",
    label: "Spade",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: Spade,
    color: "var(--primary)",
    fixed: true,
    group: "Card 1",
  },
  {
    value: "heart",
    label: "Heart",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: Heart,
    color: "var(--color-red-500)",
    group: "Card 1",
    disabled: true,
  },
  {
    value: "diamond",
    label: "Diamond",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: Diamond,
    color: "var(--color-cyan-500)",
    group: "Card 1",
  },
  {
    value: "club",
    label: "Club",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: Club,
    color: "var(--color-green-500)",
    group: "Card 1",
  },
];
const checkboxData = ["firefox", "chrome", "safari", "edge"] as const;

export function ExampleForm() {
  const now = new Date();
  const fileType: FileType = "image";

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = z.object({
    text: zodSchemas.string("Text", { min: 1 }),
    textarea: zodSchemas.string("Text Area", { min: 1, max: 255 }),

    number: zodSchemas.number("number", { min: 1 }),
    phone: zodSchemas.number("Phone", { min: 1 }),

    date: zodSchemas.date(),
    dateMultiple: zodSchemas.dateMultiple({ min: 1 }),
    dateRange: zodSchemas.dateRange,

    select: z.enum(card),
    multiSelect: z.array(z.enum(card)).min(1),
    radio: z.enum(card),

    switch: z.boolean(),
    checkbox: z.array(z.enum(checkboxData)).refine((v) => v.some((i) => i), {
      error: "At least one checkbox must be selected",
    }),

    files: zodSchemas.file(fileType, {
      // min: 1,
      // max: 5,
      // maxFileSize: toBytes(1),
    }),
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "Hello World",
      textarea: "The Brown Fox Jumping Over The Lazy Dog",

      number: 100000,
      phone: 81234567890,

      date: now,
      dateMultiple: [now],
      dateRange: { from: now, to: addDays(now, 6) },

      select: "spade",
      multiSelect: ["spade"],
      radio: "spade",

      switch: false,
      checkbox: ["firefox"],

      files: [],
    },
  });

  const formHandler = (formData: FormSchema) => {
    console.log(formatDate(formData.date, "PPPp"));
    // const res = await uploadFiles({ files: formData.file });
    toast(<pre>{JSON.stringify(formData, null, 2)}</pre>);
  };

  return (
    <form onSubmit={form.handleSubmit(formHandler)} noValidate>
      <div className="grid gap-x-2 gap-y-4 md:grid-cols-5">
        <Controller
          name="text"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldWrapper
              label="Text field"
              htmlFor={field.name}
              errors={fieldState.error}
              description="Text field description example"
            >
              <InputGroup>
                <InputGroupInput
                  type="text"
                  id={field.name}
                  aria-invalid={!!fieldState.error}
                  placeholder="Masukan text"
                  required
                  {...field}
                />
                <InputGroupAddon>
                  <TextIcon />
                </InputGroupAddon>
              </InputGroup>
            </FieldWrapper>
          )}
        />

        <Controller
          name="number"
          control={form.control}
          render={({ field: { value, onChange, ...field }, fieldState }) => (
            <FieldWrapper
              label="Number field"
              htmlFor={field.name}
              errors={fieldState.error}
            >
              <InputGroup>
                <InputGroupInput
                  type="text"
                  id={field.name}
                  aria-invalid={!!fieldState.error}
                  inputMode="numeric"
                  value={formatNumber(value)}
                  onChange={(e) => onChange(sanitizeNumber(e.target.value))}
                  placeholder="Masukkan nomor"
                  required
                  {...field}
                />
                <InputGroupAddon>123</InputGroupAddon>
              </InputGroup>
            </FieldWrapper>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field: { value, onChange, ...field }, fieldState }) => (
            <FieldWrapper
              label="Phone field"
              htmlFor={field.name}
              errors={fieldState.error}
            >
              <InputGroup>
                <InputGroupInput
                  type="text"
                  id={field.name}
                  aria-invalid={!!fieldState.error}
                  inputMode="numeric"
                  value={formatPhone(value)}
                  onChange={(e) => onChange(sanitizeNumber(e.target.value))}
                  placeholder="Masukkan nomor HP"
                  required
                  {...field}
                />
                <InputGroupAddon>+62</InputGroupAddon>
              </InputGroup>
            </FieldWrapper>
          )}
        />

        <Controller
          name="select"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldWrapper
              label="Select"
              htmlFor={field.name}
              errors={fieldState.error}
            >
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                required
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={!!fieldState.error}
                >
                  <SelectValue placeholder="Pilih kartu" />
                </SelectTrigger>
                <SelectContent>
                  {selectAndRadioData.map(
                    ({ value, label, icon: Icon, disabled }) => (
                      <SelectItem key={value} value={value} disabled={disabled}>
                        {Icon && <Icon />} {label || value}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </FieldWrapper>
          )}
        />

        <Controller
          name="multiSelect"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldWrapper
              label="Multi Select"
              htmlFor={field.name}
              errors={fieldState.error}
            >
              <MultiSelect
                defaultValue={selectAndRadioData}
                placeholder="Pilih kartu"
                value={field.value}
                onChange={(v) => field.onChange(v.map((it) => it.value))}
                props={{
                  input: {
                    id: field.name,
                    "aria-invalid": !!fieldState.error,
                    required: true,
                    ...field,
                  },
                }}
              />
            </FieldWrapper>
          )}
        />
      </div>

      <div className="grid gap-x-2 gap-y-4 md:grid-cols-3">
        <Controller
          name="date"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldWrapper
              label="Date Picker with Calendar"
              htmlFor={field.name}
              errors={fieldState.error}
            >
              <DatePicker
                id={field.name}
                invalid={!!fieldState.error}
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                required
              />
            </FieldWrapper>
          )}
        />

        <Controller
          name="dateMultiple"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldWrapper
              label="Multiple Date Picker"
              htmlFor={field.name}
              errors={fieldState.error}
            >
              <DatePicker
                id={field.name}
                invalid={!!fieldState.error}
                mode="multiple"
                selected={field.value}
                onSelect={field.onChange}
                required
              />
            </FieldWrapper>
          )}
        />

        <Controller
          name="dateRange"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldWrapper
              label="Date Range Picker"
              htmlFor={field.name}
              errors={fieldState.error}
            >
              <DatePicker
                id={field.name}
                invalid={!!fieldState.error}
                mode="range"
                selected={field.value}
                onSelect={field.onChange}
                required
              />
            </FieldWrapper>
          )}
        />
      </div>

      {/* Using FieldSet with legend and description instead: */}

      <Controller
        name="checkbox"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldSet>
            <FieldLegend>Checkboxes</FieldLegend>
            <FieldDescription>Checkbox description.</FieldDescription>
            <FieldGroup data-slot="checkbox-group">
              {checkboxData.map((value) => (
                <Field
                  key={value}
                  orientation="horizontal"
                  data-invalid={!!fieldState.error}
                >
                  <Checkbox
                    id={`cb-${value}`}
                    name={field.name}
                    aria-invalid={!!fieldState.error}
                    checked={field.value.includes(value)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.value, value]
                        : field.value.filter((v) => v !== value);
                      field.onChange(newValue);
                    }}
                  />
                  <FieldLabel
                    htmlFor={`cb-${value}`}
                    className="font-normal capitalize"
                  >
                    {value}
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
            <FieldError errors={fieldState.error} />
          </FieldSet>
        )}
      />

      <Controller
        name="radio"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldSet>
            <FieldLegend>Radio Group</FieldLegend>
            <FieldDescription>Radio group description.</FieldDescription>
            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              className="flex-col md:flex-row"
              required
            >
              {selectAndRadioData.map(({ icon: Icon, ...item }) => (
                <FieldLabel
                  key={item.value}
                  htmlFor={`rd-${item.value}`}
                  color={item.color}
                  className="border-(--field-color)/40"
                >
                  <Field
                    orientation="horizontal"
                    data-invalid={!!fieldState.error}
                  >
                    <FieldContent>
                      <FieldTitle className="text-(--field-color)">
                        <Icon /> {item.label}
                      </FieldTitle>
                      <FieldDescription className="text-(--field-color)/80">
                        {item.desc}
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      id={`rd-${item.value}`}
                      value={item.value}
                      classNames={{ circle: "fill-[var(--field-color)]" }}
                      aria-invalid={!!fieldState.error}
                    />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
            <FieldError errors={fieldState.error} />
          </FieldSet>
        )}
      />

      {/* Or field with FieldContent */}

      <Controller
        name="switch"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            orientation="horizontal"
            className="w-fit gap-4"
            data-invalid={!!fieldState.error}
          >
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Switch</FieldLabel>
              <FieldDescription>
                Boolean value using Switch or Checkbox
              </FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
            <Switch
              id={field.name}
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={!!fieldState.error}
            />
            <Checkbox
              // id={field.name}
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={!!fieldState.error}
            />
          </Field>
        )}
      />

      <Controller
        name="textarea"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label="Text Area"
            htmlFor={field.name}
            errors={fieldState.error}
          >
            <Textarea
              id={field.name}
              aria-invalid={!!fieldState.error}
              placeholder="Masukan text"
              {...field}
            />
          </FieldWrapper>
        )}
      />

      <Controller
        name="files"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label="File Upload"
            htmlFor={field.name}
            errors={fieldState.error}
          >
            <FileUpload
              id={field.name}
              accept={fileType}
              multiple
              required
              {...field}
            />
          </FieldWrapper>
        )}
      />

      <div className="flex gap-2">
        <Button type="submit">
          {/* <LoadingSpinner loading={isLoading} icon={{ base: <Save /> }} /> */}
          <Save /> {messages.actions.save}
        </Button>
        <ResetButton onClick={() => form.reset()} />
      </div>
    </form>
  );
}

export function ExampleTypography() {
  return (
    <div className="[&>p]:text-foreground/90 mx-auto max-w-4xl space-y-6 py-8 [&>p]:leading-7">
      <h1>The Subtle Shift: How LLMs Are Reshaping Web Development</h1>

      <p>
        Large Language Models (LLMs) are no longer just a research curiosity.
        They&apos;ve quietly slipped into the daily workflow of many developers,
        especially in the realm of <code>frontend</code> and <code>web</code>{" "}
        development. While some fear they might replace engineers, the reality
        is more nuanced: LLMs often function as accelerators, not replacements.
      </p>

      <h2>From Boilerplate to Brainstorming</h2>
      <p>
        Ask any web developer, and they&apos;ll tell you: boilerplate code is
        both a blessing and a burden. With LLMs, setting up a new project
        scaffold or generating a reusable <code>React</code> component can take
        seconds instead of hours.
      </p>

      <blockquote>
        “I don&apos;t use AI to finish my code. I use it to start faster,”{" "}
        <small> — A Frontend Engineer on X</small>
      </blockquote>

      <p>
        This shift means developers can spend more energy on solving real
        product problems rather than wiring up endless configuration files.
      </p>

      <h2>Documentation as Dialogue</h2>
      <p>
        Another overlooked area is documentation. LLMs turn static docs into
        interactive guides. Instead of digging through a 200-page manual,
        developers can ask natural-language questions like{" "}
        <code>“How do I debounce an input in React?”</code> and receive concise,
        context-aware answers.
      </p>

      <h2>Not a Replacement, but a Partner</h2>
      <p>
        Critics often warn that AI tools will deskill developers. In practice,
        many report the opposite. By handling routine code generation, LLMs free
        humans to focus on design patterns, accessibility, and user experience—
        areas where human empathy and creativity remain irreplaceable.
      </p>

      <blockquote>
        “Think of LLMs less as interns who write code and more as senior
        colleagues who never get tired of pair programming.”
        <small> — Tech Blogger, 2024</small>
      </blockquote>

      <h2>Conclusion</h2>
      <p>
        LLMs aren&apos;t rewriting the role of web developers—they&apos;re
        reframing it. The job shifts from writing every line by hand to guiding,
        editing, and curating. In that sense, the craft of development remains
        as human as ever—just faster, more collaborative, and a little more fun.
      </p>
    </div>
  );
}
