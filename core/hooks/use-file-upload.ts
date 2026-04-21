"use client";

import { useCallback, useRef, useState } from "react";
import { messages } from "../messages";

export type FileMetadata = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
};

export type FileWithPreview = {
  id: string;
  file: File | FileMetadata;
  preview?: string;
};

export type FileUploadOptions = {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  initialFiles?: FileMetadata[];
  onFilesChange?: (files: FileWithPreview[]) => void;
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void;
  onError?: (errors: string[]) => void;
};

export type FileUploadState = {
  files: FileWithPreview[];
  isDragging: boolean;
  errors: string[];
};

type ControlledInputProps = Omit<
  React.ComponentProps<"input">,
  "ref" | "type" | "onChange" | "accept" | "multiple"
>;

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  clearErrors: () => void;
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;

  handleDragEnter: (e: React.DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  openFileDialog: () => void;
  getInputProps: (
    props?: ControlledInputProps,
  ) => React.ComponentProps<"input">;
};

export function useFileUpload({
  maxSize = Number.POSITIVE_INFINITY,
  maxFiles = Number.POSITIVE_INFINITY,
  accept = "*",
  multiple = false,
  initialFiles = [],
  onFilesChange,
  onFilesAdded,
  onError,
}: FileUploadOptions = {}): [FileUploadState, FileUploadActions] {
  const [state, setState] = useState<FileUploadState>({
    files: initialFiles.map((file) => ({
      file,
      id: file.id,
      preview: file.url,
    })),
    isDragging: false,
    errors: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const getFileInfo = (file: File | FileMetadata) => ({
    name: file.name,
    size: file.size,
    type: file instanceof File ? file.type || "" : file.type,
    extension: `.${file.name.split(".").pop()}`,
  });

  const validateFile = useCallback(
    (file: File | FileMetadata) => {
      const { mimeInvalid, tooLarge } = messages.files;
      const { name, type, extension, size } = getFileInfo(file);

      const field = `File "${name}"`;

      if (size > maxSize) return tooLarge(field, size);
      if (accept === "*") return null;

      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const isAccepted = acceptedTypes.some((t) => {
        if (t.startsWith("."))
          return extension.toLowerCase() === t.toLowerCase();
        if (t.endsWith("/*")) return type.startsWith(`${t.split("/")[0]}/`);
        return type === t;
      });

      if (!isAccepted) return mimeInvalid(field);
      return null;
    },
    [accept, maxSize],
  );

  const createPreview = useCallback((file: File | FileMetadata) => {
    if (file instanceof File) return URL.createObjectURL(file);
    return file.url;
  }, []);

  const generateUniqueId = useCallback((file: File | FileMetadata) => {
    if (file instanceof File)
      return `${crypto.randomUUID()}.${file.name.split(".").pop()}`;
    return file.id;
  }, []);

  const clearFiles = useCallback(() => {
    for (const file of state.files) {
      if (
        file.preview &&
        file.file instanceof File &&
        file.file.type.startsWith("image/")
      )
        URL.revokeObjectURL(file.preview);
    }

    if (inputRef.current) inputRef.current.value = "";

    onFilesChange?.([]);

    setState({ ...state, files: [], errors: [] });
  }, [state, onFilesChange]);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (!newFiles || newFiles.length === 0) return;

      const newFilesArray = Array.from(newFiles);
      const errors: string[] = [];

      setState((prev) => ({ ...prev, errors: [] }));

      if (!multiple) clearFiles();

      if (
        multiple &&
        maxFiles !== Number.POSITIVE_INFINITY &&
        state.files.length + newFilesArray.length > maxFiles
      ) {
        errors.push(`You can only upload a maximum of ${maxFiles} files.`);
        onError?.(errors);
        setState((prev) => ({ ...prev, errors }));
        return;
      }

      const validFiles: FileWithPreview[] = [];

      for (const file of newFilesArray) {
        if (multiple) {
          const isDuplicate = state.files.some(
            (existingFile) =>
              existingFile.file.name === file.name &&
              existingFile.file.size === file.size,
          );
          if (isDuplicate) continue;
        }

        const error = validateFile(file);
        if (error) {
          errors.push(error);
          continue;
        }

        validFiles.push({
          file,
          id: generateUniqueId(file),
          preview: createPreview(file),
        });
      }

      if (validFiles.length > 0) {
        const newFiles = !multiple
          ? validFiles
          : [...state.files, ...validFiles];

        onFilesAdded?.(validFiles);
        onFilesChange?.(newFiles);

        setState((prev) => ({ ...prev, files: newFiles, errors }));
      } else if (errors.length > 0) {
        onError?.(errors);
        setState((prev) => ({ ...prev, errors }));
      }

      if (inputRef.current) inputRef.current.value = "";
    },
    [
      state.files,
      maxFiles,
      multiple,
      validateFile,
      createPreview,
      generateUniqueId,
      clearFiles,
      onFilesAdded,
      onFilesChange,
      onError,
    ],
  );

  const removeFile = useCallback(
    (id: string) => {
      setState((prev) => {
        const fileToRemove = prev.files.find((file) => file.id === id);

        if (
          fileToRemove &&
          fileToRemove.preview &&
          fileToRemove.file instanceof File &&
          fileToRemove.file.type.startsWith("image/")
        ) {
          URL.revokeObjectURL(fileToRemove.preview);
        }

        const newFiles = prev.files.filter((file) => file.id !== id);
        onFilesChange?.(newFiles);

        return {
          ...prev,
          files: newFiles,
          errors: [],
        };
      });
    },
    [onFilesChange],
  );

  const clearErrors = useCallback(() => {
    setState((prev) => ({ ...prev, errors: [] }));
  }, []);

  const moveUp = useCallback(
    (id: string) => {
      setState((prev) => {
        const index = prev.files.findIndex((file) => file.id === id);
        if (index === -1) return prev;

        const newFiles = [...prev.files];
        const targetIndex = index === 0 ? newFiles.length - 1 : index - 1;
        [newFiles[targetIndex], newFiles[index]] = [
          newFiles[index],
          newFiles[targetIndex],
        ];
        onFilesChange?.(newFiles);
        return { ...prev, files: newFiles };
      });
    },
    [onFilesChange],
  );

  const moveDown = useCallback(
    (id: string) => {
      setState((prev) => {
        const index = prev.files.findIndex((file) => file.id === id);
        if (index === -1) return prev;

        const newFiles = [...prev.files];
        const targetIndex = index === newFiles.length - 1 ? 0 : index + 1;
        [newFiles[targetIndex], newFiles[index]] = [
          newFiles[index],
          newFiles[targetIndex],
        ];
        onFilesChange?.(newFiles);
        return { ...prev, files: newFiles };
      });
    },
    [onFilesChange],
  );

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget as Node)) return;

    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setState((prev) => ({ ...prev, isDragging: false }));

      if (inputRef.current?.disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if (!multiple) addFiles([e.dataTransfer.files[0]]);
        else addFiles(e.dataTransfer.files);
      }
    },
    [addFiles, multiple],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) addFiles(e.target.files);
    },
    [addFiles],
  );

  const openFileDialog = useCallback(() => inputRef.current?.click(), []);

  const getInputProps = useCallback(
    (props: ControlledInputProps = {}): React.ComponentProps<"input"> => ({
      ...props,
      ref: inputRef,
      type: "file",
      accept,
      multiple,
      onChange: handleFileChange,
    }),
    [accept, multiple, handleFileChange],
  );

  return [
    state,
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      moveUp,
      moveDown,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ];
}
