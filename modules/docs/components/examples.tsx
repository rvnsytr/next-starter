"use client";

import { fileTypeConfig } from "@/config/file-type";
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
import { toast } from "@/core/components/ui/toast";
import { useFileUpload } from "@/core/hooks/use-file-upload";
import { toBytes } from "@/core/utils/formaters";
import { SearchIcon } from "lucide-react";

export function UseFileUploadExample() {
  const [
    { files, errors },
    { openFileDialog, getInputProps, clearFiles, clearErrors },
  ] = useFileUpload({
    maxSize: toBytes(1),
    accept: fileTypeConfig.image.mimeTypes.join(","),
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

export function FileDropzoneExample() {
  return <p>Hello World</p>;
  // return <FileDropzone />;
}

export function AutocompleteExample({
  size,
}: Pick<React.ComponentProps<typeof AutocompleteInput>, "size">) {
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
