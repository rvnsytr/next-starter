import { FileVisibility } from "@/core/s3";
import { Route } from "next";

export const CALLBACK_URLS: Route[] = ["/", "/dashboard"];

export const DEFAULT_LANGUAGE = "id";
export const DEFAULT_NUMBER_LOCALE = "id";

export const DEFAULT_S3_FILE_DIRECTORY = "global";
export const DEFAULT_S3_FILE_VISIBILITY: FileVisibility = "private";
