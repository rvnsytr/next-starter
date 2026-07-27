import { FileMetadata } from "../types";

export function getFileInfo(file: File | FileMetadata) {
  return {
    name: file.name,
    size: file.size,
    type: file.type ?? "",
    extension: `.${file.name.split(".").pop()}`,
  };
}

export function getFileNameParts(originalFileName: string) {
  const parts = originalFileName.split(".");
  const fileName = parts.slice(0, -1).join(".");
  const extension = parts.at(-1) ?? "";
  return { fileName, extension };
}
