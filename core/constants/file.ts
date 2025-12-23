import {
  FileArchive,
  Files,
  FileSpreadsheet,
  FileText,
  Headphones,
  Image,
  LucideIcon,
  TableIcon,
  Upload,
  Video,
} from "lucide-react";
import { toBytes } from "../utils";

export type FileType =
  | "file"
  | "image"
  | "pdf"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "office"
  | "archive"
  | "audio"
  | "video";

type FileMetaProps = Record<
  FileType,
  {
    displayName: string;
    mimeTypes: string[];
    extensions: string[];
    size: { mb: number; bytes: number };
    icon: LucideIcon;
  }
>;

const meta: Omit<FileMetaProps, "file" | "office"> = {
  image: {
    displayName: "gambar",
    mimeTypes: ["image/png", "image/jpeg", "image/svg+xml", "image/webp"],
    extensions: [".png", ".jpg", ".jpeg", ".svg", ".webp"],
    size: { mb: 2, bytes: toBytes(2) },
    icon: Image,
  },

  pdf: {
    displayName: "PDF",
    mimeTypes: ["application/pdf"],
    extensions: [".pdf"],
    size: { mb: 2, bytes: toBytes(2) },
    icon: FileArchive,
  },

  document: {
    displayName: "dokumen",
    mimeTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    extensions: [".doc", ".docx"],
    size: { mb: 2, bytes: toBytes(2) },
    icon: FileText,
  },

  spreadsheet: {
    displayName: "lembar kerja (spreadsheet)",
    mimeTypes: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    extensions: [".xls", ".xlsx"],
    size: { mb: 2, bytes: toBytes(2) },
    icon: FileSpreadsheet,
  },

  presentation: {
    displayName: "presentasi (ppt)",
    mimeTypes: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    extensions: [".ppt", ".pptx"],
    size: { mb: 10, bytes: toBytes(10) },
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
    size: { mb: 20, bytes: toBytes(20) },
    icon: FileArchive,
  },

  audio: {
    displayName: "audio",
    mimeTypes: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"],
    extensions: [".mp3", ".wav", ".ogg", ".flac"],
    size: { mb: 10, bytes: toBytes(10) },
    icon: Headphones,
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
    size: { mb: 50, bytes: toBytes(50) },
    icon: Video,
  },
};

const maxFileSize = Math.max(...Object.values(meta).map(({ size }) => size.mb));

export const fileMeta: FileMetaProps = {
  file: {
    displayName: "berkas",
    mimeTypes: Object.values(meta).flatMap((item) => item.mimeTypes),
    extensions: Object.values(meta).flatMap((item) => item.extensions),
    size: { mb: maxFileSize, bytes: toBytes(maxFileSize) },
    icon: Upload,
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
    size: { mb: 10, bytes: toBytes(10) },
    icon: Files,
  },

  ...meta,
};
