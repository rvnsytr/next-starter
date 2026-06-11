"use client";

import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
} from "@/core/components/ui/autocomplete";
import { Button } from "@/core/components/ui/button";
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
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/core/components/ui/stepper";
import { toast } from "@/core/components/ui/toast";
import { useFileUpload } from "@/core/hooks/use-file-upload";
import { fileTypeConfig } from "@/shared/config";
import { SearchIcon } from "lucide-react";

export function UseFileUploadExample() {
  const {
    files,
    errors,
    openFileDialog,
    getInputProps,
    clearFiles,
    clearErrors,
  } = useFileUpload({
    ...fileTypeConfig.file,
    multiple: true,
    onFilesChange: (f) => {
      const file = f[0];
      if (file.file instanceof File) console.log("file: ", file);
      else console.log("meh: ", file);
    },
  });

  return (
    <div className="flex flex-col gap-y-4">
      <input {...getInputProps()} className="sr-only" />

      <div className="flex flex-wrap justify-center gap-x-2 gap-y-4">
        <Button onClick={openFileDialog}>Upload Images</Button>
        <Button onClick={clearFiles}>Clear Images</Button>
        <Button onClick={clearErrors}>Clear Errors</Button>
      </div>

      {files.map((file) => (
        <div key={file.id}>{file.id}</div>
      ))}

      {errors.map((error, index) => (
        <div key={index} className="text-destructive-foreground">
          {error}
        </div>
      ))}
    </div>
  );
}

export function FileUploadExample() {
  return <p>Hello World</p>;
  // return <FileDropzone />;
}

const items = [
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
];

export function AutocompleteExample({
  size,
}: Pick<React.ComponentProps<typeof AutocompleteInput>, "size">) {
  return (
    <Autocomplete items={items}>
      <AutocompleteInput
        size={size}
        aria-label="Search items"
        placeholder="Search items…"
        startAddon={<SearchIcon />}
        showClear
        showTrigger
      />
      <AutocompletePopup>
        <AutocompleteEmpty>No items found.</AutocompleteEmpty>
        <AutocompleteList>
          {(item) => (
            <AutocompleteItem key={item.value} value={item}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompletePopup>
    </Autocomplete>
  );
}

export function ComboboxExample() {
  return (
    <Combobox
      defaultValue={[items[0], items[3]]}
      items={items}
      autoHighlight
      multiple
    >
      <ComboboxChips startAddon={<SearchIcon />}>
        <ComboboxValue>
          {(value: { value: string; label: string }[]) => (
            <>
              {value?.map((item) => (
                <ComboboxChip aria-label={item.label} key={item.value}>
                  {item.label}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                placeholder={value.length > 0 ? undefined : "Select a item..."}
                aria-label="Select a item"
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxPopup>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
}

const steps = [
  {
    description: "Desc for step one",
    step: 1,
    title: "Step One",
  },
  {
    description: "Desc for step two",
    step: 2,
    title: "Step Two",
  },
  {
    description: "Desc for step three",
    step: 3,
    title: "Step Three",
  },
];

export function StepperExample() {
  return (
    <div className="space-y-8 text-center">
      <Stepper defaultValue={2}>
        {steps.map(({ step, title, description }) => (
          <StepperItem
            className="relative flex-1 flex-col!"
            key={step}
            step={step}
          >
            <StepperTrigger className="flex-col gap-3 rounded">
              <StepperIndicator />
              <div className="space-y-0.5 px-2">
                <StepperTitle>{title}</StepperTitle>
                <StepperDescription className="max-sm:hidden">
                  {description}
                </StepperDescription>
              </div>
            </StepperTrigger>
            {step < steps.length && (
              <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
            )}
          </StepperItem>
        ))}
      </Stepper>
      <p
        aria-live="polite"
        className="text-muted-foreground mt-2 text-xs"
        role="region"
      >
        Stepper with titles and descriptions
      </p>
    </div>
  );
}

export function ToastExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => {
          toast.add({
            type: "success",
            title: "Success!",
            description: "Your changes have been saved.",
          });
        }}
      >
        Success Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({
            type: "error",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        }}
      >
        Error Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({
            type: "info",
            title: "Heads up!",
            description: "You can add components to your app using the cli.",
          });
        }}
      >
        Info Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({
            type: "warning",
            title: "Warning!",
            description: "Your session is about to expire.",
          });
        }}
      >
        Warning Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.promise(
            new Promise<string>((resolve, reject) => {
              const shouldSucceed = Math.random() > 0.3;
              setTimeout(() => {
                if (shouldSucceed) resolve("Data loaded successfully");
                else reject(new Error("Failed to load data"));
              }, 2000);
            }),
            {
              loading: {
                title: "Loading...",
                description: "The promise is loading.",
              },
              success: (data: string) => ({
                title: "This is a success toast!",
                description: `Success: ${data}`,
              }),
              error: () => ({
                title: "Something went wrong",
                description: "Please try again.",
              }),
            },
          );
        }}
      >
        Run Promise
      </Button>
    </div>
  );
}
