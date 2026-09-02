import { toBytes } from "@/core/utils";
import {
  FileArchiveIcon,
  FileIcon,
  FilesIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  LucideIcon,
  TableIcon,
  VideoIcon,
} from "lucide-react";

export type FileType = (typeof FILE_TYPES)[number];

export type FileTypeDef = {
  label: string;
  icon: LucideIcon;
  maxSize: number;
  accept: string;
  extensions: string[];
};

export type FileTypeMeta = Record<FileType, FileTypeDef>;

export const FILE_TYPES = [
  "image",
  "pdf",
  "document",
  "spreadsheet",
  "presentation",
  "archive",
  "audio",
  "video",
  "file",
  "office-document",
] as const;

const META: Omit<FileTypeMeta, "file" | "office-document"> = {
  image: {
    label: "gambar",
    icon: ImageIcon,
    maxSize: toBytes(2),
    accept: "image/png, image/jpeg, image/svg+xml, image/webp",
    extensions: [".png", ".jpg", ".jpeg", ".svg", ".webp"],
  },

  pdf: {
    label: "PDF",
    icon: FileArchiveIcon,
    maxSize: toBytes(2),
    accept: "application/pdf",
    extensions: [".pdf"],
  },

  document: {
    label: "dokumen",
    icon: FileTextIcon,
    maxSize: toBytes(2),
    accept: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].join(", "),
    extensions: [".doc", ".docx"],
  },

  spreadsheet: {
    label: "lembar kerja (spreadsheet)",
    icon: FileSpreadsheetIcon,
    maxSize: toBytes(2),
    accept: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ].join(", "),
    extensions: [".xls", ".xlsx"],
  },

  presentation: {
    label: "presentasi (ppt)",
    icon: TableIcon,
    maxSize: toBytes(10),
    accept: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ].join(", "),
    extensions: [".ppt", ".pptx"],
  },

  archive: {
    label: "arsip",
    icon: FileArchiveIcon,
    maxSize: toBytes(20),
    accept: [
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
      "application/x-tar",
    ].join(", "),
    extensions: [".zip", ".rar", ".7z", ".tar"],
  },

  audio: {
    label: "audio",
    icon: HeadphonesIcon,
    maxSize: toBytes(10),
    accept: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"].join(", "),
    extensions: [".mp3", ".wav", ".ogg", ".flac"],
  },

  video: {
    label: "video",
    icon: VideoIcon,
    maxSize: toBytes(50),
    accept: [
      "video/mp4",
      "video/x-msvideo",
      "video/x-matroska",
      "video/ogg",
      "video/webm",
    ].join(", "),
    extensions: [".mp4", ".avi", ".mkv", ".ogg", ".webm"],
  },
};

export const FILE_TYPE_META: FileTypeMeta = {
  file: {
    label: "berkas",
    icon: FileIcon,
    maxSize: Math.max(...Object.values(META).map((c) => c.maxSize)),
    accept: "*",
    extensions: [],
  },

  "office-document": {
    label: "dokumen kantor",
    icon: FilesIcon,
    maxSize: toBytes(10),
    accept: [
      ...META.pdf.accept.split(", "),
      ...META.document.accept.split(", "),
      ...META.spreadsheet.accept.split(", "),
      ...META.presentation.accept.split(", "),
    ].join(", "),
    extensions: [
      ...META.pdf.extensions,
      ...META.document.extensions,
      ...META.spreadsheet.extensions,
      ...META.presentation.extensions,
    ],
  },

  ...META,
};
