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

export type FileMetaType = (typeof allFileMetaTypes)[number];
export const allFileMetaTypes = [
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

export type FileMetaProps = Record<
  FileMetaType,
  {
    displayName: string;
    mimeTypes: string[];
    extensions: string[];
    defaultSize: number;
    icon: LucideIcon;
  }
>;

const meta: Omit<FileMetaProps, "file" | "office"> = {
  image: {
    displayName: "gambar",
    mimeTypes: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"],
    extensions: [".png", ".jpg", ".jpeg", ".svg", ".webp"],
    defaultSize: toBytes(2),
    icon: ImageIcon,
  },

  pdf: {
    displayName: "PDF",
    mimeTypes: ["application/pdf"],
    extensions: [".pdf"],
    defaultSize: toBytes(2),
    icon: FileArchiveIcon,
  },

  document: {
    displayName: "dokumen",
    mimeTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    extensions: [".doc", ".docx"],
    defaultSize: toBytes(2),
    icon: FileTextIcon,
  },

  spreadsheet: {
    displayName: "lembar kerja (spreadsheet)",
    mimeTypes: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    extensions: [".xls", ".xlsx"],
    defaultSize: toBytes(2),
    icon: FileSpreadsheetIcon,
  },

  presentation: {
    displayName: "presentasi (ppt)",
    mimeTypes: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    extensions: [".ppt", ".pptx"],
    defaultSize: toBytes(10),
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
    defaultSize: toBytes(20),
    icon: FileArchiveIcon,
  },

  audio: {
    displayName: "audio",
    mimeTypes: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"],
    extensions: [".mp3", ".wav", ".ogg", ".flac"],
    defaultSize: toBytes(10),
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
    defaultSize: toBytes(50),
    icon: VideoIcon,
  },
};

export const fileMeta: FileMetaProps = {
  file: {
    displayName: "berkas",
    mimeTypes: ["*"],
    extensions: Object.values(meta).flatMap((item) => item.extensions),
    defaultSize: Number.POSITIVE_INFINITY,
    icon: UploadIcon,
  },

  office: {
    displayName: "dokumen kantor",
    mimeTypes: [
      ...meta.pdf.mimeTypes,
      ...meta.document.mimeTypes,
      ...meta.spreadsheet.mimeTypes,
      ...meta.presentation.mimeTypes,
    ],
    extensions: [
      ...meta.pdf.extensions,
      ...meta.document.extensions,
      ...meta.spreadsheet.extensions,
      ...meta.presentation.extensions,
    ],
    defaultSize: toBytes(10),
    icon: FilesIcon,
  },

  ...meta,
};
