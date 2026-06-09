import { appConfig } from "@/shared/config";
import { FileTable, FileVisibility } from "@/shared/db/schema";
import {
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FileWithPreview, Override } from "./types";

const S3_PUBLIC_ENDPOINT = process.env.S3_PUBLIC_ENDPOINT!;
const S3_BUCKET = process.env.S3_BUCKET!;
const S3_PUBLIC_BUCKET = process.env.S3_PUBLIC_BUCKET!;

const defaultFileDirectory = appConfig.default.fileDirectory;
const defaultFileVisibility: FileVisibility = "private";

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

type Visibility = {
  /**
   * The visibility of the file.
   *
   * @default "private"
   */
  visibility?: FileVisibility;
};

type ControlledS3Options<T> = Override<Omit<T, "Key" | "Bucket">, Visibility>;

export type PrepareFilesOptions = Visibility & {
  /** A function to set the path for each file. */
  setPath?: (file: FileWithPreview, index: number) => string;
};

export type UploadFilesPayload = {
  /** The file to upload. */
  file: File;

  /**
   * The path where the file will be uploaded.
   *
   * @default `${appConfig.default.fileDirectory}/${file.name}`
   * */
  path?: string;

  /** The visibility of the file. If provided, it overrides the `visibility` value from the upload options. */
  visibility?: FileVisibility;
};

export type UploadFilesOptions = ControlledS3Options<
  Omit<PutObjectCommandInput, "Body" | "ContentType">
>;

export type UploadFilesResponse = {
  file: Pick<FileTable, "path" | "name" | "type" | "size" | "visibility">;
  output: PutObjectCommandOutput;
};

const getBucket = (v: FileVisibility = "private") =>
  v === "public" ? S3_PUBLIC_BUCKET : S3_BUCKET;

/**
 * Prepare files for upload by setting their paths and visibility.
 *
 * @example
 * const { upload, db } = prepareFiles(filesWithPreview, {
 *   visibility: "public",
 *   setPath: (file) => `public-directory/${file.name}`,
 * });
 *
 */
export function prepareFiles(
  files: FileWithPreview[],
  options?: PrepareFilesOptions,
) {
  const upload: UploadFilesPayload[] = [];
  const db: Pick<
    FileTable,
    "path" | "name" | "type" | "size" | "visibility"
  >[] = [];

  const visibility = options?.visibility ?? defaultFileVisibility;

  files.forEach((item, index) => {
    let path: string | null = null;

    if (item.file instanceof File) {
      path = options?.setPath
        ? options.setPath(item, index)
        : `${defaultFileDirectory}/${item.file.name}`;
      upload.push({ file: item.file, path, visibility });
    } else path = item.file.path;

    db.push({
      path,
      name: item.file.name,
      type: item.file.type,
      size: item.file.size,
      visibility,
    });
  });

  return { upload, db };
}

/**
 * Upload files to S3.
 *
 * @example
 * const { upload, db } = prepareFiles(filesWithPreview, {
 *   visibility: "public",
 *   setPath: (file) => `public-directory/${file.name}`,
 * });
 *
 * const results = await uploadFiles(upload, {
 *   visibility: "public", // Optional, can be overridden by each payload's `visibility` property
 * });
 */
export async function uploadFiles(
  payloads: UploadFilesPayload[],
  options?: UploadFilesOptions,
): Promise<UploadFilesResponse[]> {
  "use server";

  return await Promise.all(
    payloads.map(async (payload) => {
      const Key =
        payload.path ?? `${defaultFileDirectory}/${payload.file.name}`;

      const visibility =
        payload.visibility ?? options?.visibility ?? defaultFileVisibility;

      const command = new PutObjectCommand({
        Key,
        Body: Buffer.from(await payload.file.arrayBuffer()),
        ContentType: payload.file.type,
        Bucket: getBucket(visibility),
        ...options,
      });

      return {
        file: {
          path: Key,
          name: payload.file.name,
          type: payload.file.type,
          size: payload.file.size,
          visibility,
        },
        output: await s3.send(command),
      };
    }),
  );
}

export async function listFiles(
  options?: ControlledS3Options<ListObjectsV2CommandInput>,
) {
  "use server";
  const Bucket = getBucket(options?.visibility);
  const command = new ListObjectsV2Command({ Bucket, ...options });
  return await s3.send(command);
}

export async function createSignedUrls(
  filePaths: string[],
  options?: ControlledS3Options<GetObjectCommandInput>,
) {
  "use server";
  const Bucket = getBucket(options?.visibility);
  return await Promise.all(
    filePaths.map(async (filePath) => {
      const command = new GetObjectCommand({
        Key: filePath,
        Bucket,
        ...options,
      });

      return await getSignedUrl(s3, command);
    }),
  );
}

export function createPublicUrls(filePaths: string[]) {
  return filePaths.map((filePath) => {
    return `${S3_PUBLIC_ENDPOINT}/${S3_PUBLIC_BUCKET}/${encodeURIComponent(filePath)}`;
  });
}

/**
 * Delete files from S3.
 *
 * @example
 * const results = await deleteFiles(["public-directory/photo.jpg"], {
 *   visibility: "public",
 * });
 */
export async function deleteFiles(
  filePaths: string[],
  options?: ControlledS3Options<Omit<DeleteObjectsCommandInput, "Delete">>,
) {
  "use server";
  if (!filePaths.length) return [];

  const Bucket = getBucket(options?.visibility);
  const command = new DeleteObjectsCommand({
    Bucket,
    Delete: { Objects: filePaths.map((Key) => ({ Key })), Quiet: false },
    ...options,
  });

  return await s3.send(command);
}
