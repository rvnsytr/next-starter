import { toBytes } from "@/core/utils/formaters";
import {
  FileArchiveIcon,
  FilesIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  LucideIcon,
  TableIcon,
  UploadIcon,
  VideoIcon,
} from "lucide-react";

export type FileType = (typeof allFileTypes)[number];
export const allFileTypes = [
  "file",
  "image",
  "pdf",
  "document",
  "spreadsheet",
  "presentation",
  "office",
  "archive",
  "audio",
  "video",
] as const;

export type FileTypeConfig = Record<
  FileType,
  {
    displayName: string;
    mimeTypes: string[];
    extensions: string[];
    maxSize: number;
    icon: LucideIcon;
  }
>;

const config: Omit<FileTypeConfig, "file" | "office"> = {
  image: {
    displayName: "gambar",
    mimeTypes: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"],
    extensions: [".png", ".jpg", ".jpeg", ".svg", ".webp"],
    maxSize: toBytes(2),
    icon: ImageIcon,
  },

  pdf: {
    displayName: "PDF",
    mimeTypes: ["application/pdf"],
    extensions: [".pdf"],
    maxSize: toBytes(2),
    icon: FileArchiveIcon,
  },

  document: {
    displayName: "dokumen",
    mimeTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    extensions: [".doc", ".docx"],
    maxSize: toBytes(2),
    icon: FileTextIcon,
  },

  spreadsheet: {
    displayName: "lembar kerja (spreadsheet)",
    mimeTypes: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    extensions: [".xls", ".xlsx"],
    maxSize: toBytes(2),
    icon: FileSpreadsheetIcon,
  },

  presentation: {
    displayName: "presentasi (ppt)",
    mimeTypes: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    extensions: [".ppt", ".pptx"],
    maxSize: toBytes(10),
    icon: TableIcon,
  },

  archive: {
    displayName: "arsip",
    mimeTypes: [
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
      "application/x-tar",
    ],
    extensions: [".zip", ".rar", ".7z", ".tar"],
    maxSize: toBytes(20),
    icon: FileArchiveIcon,
  },

  audio: {
    displayName: "audio",
    mimeTypes: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"],
    extensions: [".mp3", ".wav", ".ogg", ".flac"],
    maxSize: toBytes(10),
    icon: HeadphonesIcon,
  },

  video: {
    displayName: "video",
    mimeTypes: [
      "video/mp4",
      "video/x-msvideo",
      "video/x-matroska",
      "video/ogg",
      "video/webm",
    ],
    extensions: [".mp4", ".avi", ".mkv", ".ogg", ".webm"],
    maxSize: toBytes(50),
    icon: VideoIcon,
  },
};

export const fileTypeConfig: FileTypeConfig = {
  file: {
    displayName: "berkas",
    mimeTypes: ["*"],
    extensions: Object.values(config).flatMap((t) => t.extensions),
    maxSize: Number.POSITIVE_INFINITY,
    icon: UploadIcon,
  },

  office: {
    displayName: "dokumen kantor",
    mimeTypes: [
      ...config.pdf.mimeTypes,
      ...config.document.mimeTypes,
      ...config.spreadsheet.mimeTypes,
      ...config.presentation.mimeTypes,
    ],
    extensions: [
      ...config.pdf.extensions,
      ...config.document.extensions,
      ...config.spreadsheet.extensions,
      ...config.presentation.extensions,
    ],
    maxSize: toBytes(10),
    icon: FilesIcon,
  },

  ...config,
};
