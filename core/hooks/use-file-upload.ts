"use client";

import { useCallback, useRef, useState } from "react";
import { FileMetaType } from "../constants/file";
import { formatBytes } from "../utils/formaters";

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
  accept?: FileMetaType | string[];
  maxFiles?: number;
  maxSize?: number;
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

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  clearErrors: () => void;
  handleDragEnter: (e: React.DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openFileDialog: () => void;
  getInputProps: (
    props?: React.InputHTMLAttributes<HTMLInputElement>,
  ) => React.InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>;
  };
};

export const useFileUpload = (options?: FileUploadOptions) => {
  //   const {
  //     accept = "a",
  //     maxFiles = Number.POSITIVE_INFINITY,
  //     maxSize = Number.POSITIVE_INFINITY,
  //     multiple = false,
  //     initialFiles = [],
  //     onFilesChange,
  //     onFilesAdded,
  //     onError,
  //   } = options;

  const maxFiles = options?.maxFiles ?? Number.POSITIVE_INFINITY;
  const maxSize = options?.maxSize ?? Number.POSITIVE_INFINITY;
  const initialFiles = options?.initialFiles ?? [];

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
      const { name, type, extension, size } = getFileInfo(file);

      if (size > maxSize)
        return `File "${name}" exceeds the maximum size of ${formatBytes(maxSize)}.`;

      if (accept === "*") return null;

      const acceptedTypes = accept.split(",").map((t) => t.trim());

      const isAccepted = acceptedTypes.some((t) => {
        if (t.startsWith("."))
          return extension.toLowerCase() === t.toLowerCase();
        if (t.endsWith("/*")) {
          const base = t.split("/")[0];
          return type.startsWith(`${base}/`);
        }
        return type === t;
      });

      if (!isAccepted) return `File "${name}" is not an accepted file type.`;
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
      return `${file.name}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
    return file.id;
  }, []);

  const clearFiles = useCallback(() => {
    setState((prev) => {
      for (const file of prev.files) {
        if (
          file.preview &&
          file.file instanceof File &&
          file.file.type.startsWith("image/")
        )
          URL.revokeObjectURL(file.preview);
      }

      if (inputRef.current) inputRef.current.value = "";

      const newState = { ...prev, files: [], errors: [] };
      onFilesChange?.(newState.files);
      return newState;
    });
  }, [onFilesChange]);

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
        onFilesAdded?.(validFiles);

        setState((prev) => {
          const newFiles = !multiple
            ? validFiles
            : [...prev.files, ...validFiles];
          onFilesChange?.(newFiles);
          return { ...prev, files: newFiles, errors };
        });
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
      onFilesChange,
      onFilesAdded,
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

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const getInputProps = useCallback(
    (props: React.InputHTMLAttributes<HTMLInputElement> = {}) => ({
      ...props,
      type: "file" as const,
      onChange: handleFileChange,
      accept: props.accept ?? accept,
      multiple: props.multiple ?? multiple,
      ref: inputRef,
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
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ];
};
