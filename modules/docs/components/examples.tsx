"use client";

import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
} from "@/core/components/ui/autocomplete";
import { Badge } from "@/core/components/ui/badge";
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
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/core/components/ui/stepper";
import { toast } from "@/core/components/ui/toast";
import { fileTypeConfig } from "@/core/config/file-type";
import { useFileUpload } from "@/core/hooks/use-file-upload";
import {
  BookUserIcon,
  CheckIcon,
  CreditCardIcon,
  LoaderCircleIcon,
  LockIcon,
  SearchIcon,
} from "lucide-react";
import { useState } from "react";

export function UseFileUploadExample() {
  const [
    { files, errors },
    { openFileDialog, getInputProps, clearFiles, clearErrors },
  ] = useFileUpload({
    ...fileTypeConfig,
    multiple: true,
    onFilesChange: (f) => {
      const file = f[0];
      if (file instanceof File) console.log("file: ", file);
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
        <div key={index} className="text-destructive">
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
    title: "User Details",
    icon: <BookUserIcon className="size-4" />,
  },
  {
    title: "Payment Info",
    icon: <CreditCardIcon className="size-4" />,
  },
  {
    title: "Auth OTP",
    icon: <LockIcon className="size-4" />,
  },
];

export function StepperExample() {
  const [currentStep, setCurrentStep] = useState(2);

  return (
    <Stepper
      value={currentStep}
      onValueChange={setCurrentStep}
      indicators={{
        completed: <CheckIcon className="size-3.5" />,
        loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
      }}
      className="w-full max-w-xl space-y-8"
    >
      <StepperNav className="gap-3">
        {steps.map((step, index) => (
          <StepperItem
            key={index}
            step={index + 1}
            className="relative flex-1 items-start"
          >
            <StepperTrigger
              className="flex grow flex-col items-start justify-center gap-2.5"
              asChild
            >
              <StepperIndicator className="data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground data-[state=completed]:bg-success size-8 border-2 data-[state=completed]:text-white data-[state=inactive]:bg-transparent">
                {step.icon}
              </StepperIndicator>
              <div className="flex flex-col items-start gap-1">
                <div className="text-muted-foreground text-[10px] font-semibold uppercase">
                  Step {index + 1}
                </div>
                <StepperTitle className="group-data-[state=inactive]/step:text-muted-foreground text-start text-base font-semibold">
                  {step.title}
                </StepperTitle>
                <div>
                  <Badge className="hidden group-data-[state=active]/step:inline-flex">
                    In Progress
                  </Badge>
                  <Badge
                    variant="success"
                    className="hidden group-data-[state=completed]/step:inline-flex"
                  >
                    Completed
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-muted-foreground hidden group-data-[state=inactive]/step:inline-flex"
                  >
                    Pending
                  </Badge>
                </div>
              </div>
            </StepperTrigger>

            {steps.length > index + 1 && (
              <StepperSeparator className="group-data-[state=completed]/step:bg-success absolute inset-x-0 inset-s-9 top-4 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
            )}
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className="text-sm">
        {steps.map((step, index) => (
          <StepperContent
            key={index}
            value={index + 1}
            className="flex items-center justify-center"
          >
            {step.title} content
          </StepperContent>
        ))}
      </StepperPanel>

      <div className="flex items-center justify-between gap-2.5">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={currentStep === steps.length}
        >
          Next
        </Button>
      </div>
    </Stepper>
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
