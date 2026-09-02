import { appConfig } from "@/shared/configs";
import { FileTable } from "@/shared/db/types";
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
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FileWithPreview, Override } from "../types";
import { s3, S3_BUCKET, S3_PUBLIC_BUCKET, S3_PUBLIC_ENDPOINT } from "./client";

export type FileVisibility = FileTable["visibility"];

type FileRecord = Pick<
  FileTable,
  "path" | "name" | "type" | "size" | "visibility"
>;

type ControlledS3Options<T> = Override<
  Omit<T, "Key" | "Bucket">,
  {
    /**
     * The visibility of the target file(s).
     *
     * Used by all file operations to determine whether
     * the file should be treated as `private` or `public`,
     * and to select the corresponding storage bucket.
     *
     * @default "private"
     */
    visibility?: FileVisibility;
  }
>;

export const getBucket = (v: FileVisibility = "private") =>
  v === "private" ? S3_BUCKET : S3_PUBLIC_BUCKET;

export type CreateFilePayloadsOptions = {
  /**
   * The storage path for the file.
   *
   * Can be either a fixed path or a function that generates a path
   * for each file.
   *
   * @default `<default-directory>/${file.name}`
   */
  path?: string | ((file: FileWithPreview, index: number) => string);

  /**
   * The visibility of the file.
   *
   * Can be either a fixed value or a function that returns the
   * visibility for each file. The visibility determines the file's
   * access level and the storage bucket it belongs to.
   *
   * @default "private"
   */
  visibility?:
    FileVisibility | ((file: FileWithPreview, index: number) => FileVisibility);
};

export type CreateFilePayloadsResponse = {
  upload: UploadFilesPayload[];
  records: FileRecord[];
};

export type UploadFilesPayload = {
  /** The file to upload. */
  file: File;

  /**
   * The storage path for the file.
   *
   * Determines where the file will be stored.
   *
   * @default `<default-directory>/${file.name}`
   */
  path?: string;

  /**
   * The visibility of the file.
   *
   * Determines the file's access level and the storage bucket it will
   * be uploaded to.
   *
   * @default "private"
   */
  visibility?: FileVisibility;
};

export type UploadFilesOptions = Omit<
  PutObjectCommandInput,
  "Key" | "Bucket" | "Body" | "ContentType"
>;

export type UploadFilesResponse = {
  file: FileRecord;
  output: PutObjectCommandOutput;
};

/**
 * Creates upload and database record payloads for a collection of files.
 *
 * Each file is assigned a storage path and visibility before generating
 * the payloads.
 *
 * @example
 * const { upload, records } = createFilePayloads(files, {
 *   path: (file) => `public-directory/${file.name}`,
 *   visibility: "public",
 * });
 */
export function createFilePayloads(
  files: FileWithPreview[],
  options?: CreateFilePayloadsOptions,
): CreateFilePayloadsResponse {
  const upload: CreateFilePayloadsResponse["upload"] = [];
  const records: CreateFilePayloadsResponse["records"] = [];

  const { s3FileDirectory, s3FileVisibility } = appConfig.default;

  files.forEach((item, index) => {
    let path = `${s3FileDirectory}/${item.file.name}`;
    let visibility: FileVisibility = s3FileVisibility;

    if (item.file instanceof File) {
      if (options?.path) {
        path =
          typeof options.path === "function"
            ? options.path(item, index)
            : options.path;
      }

      if (options?.visibility) {
        visibility =
          typeof options.visibility === "function"
            ? options.visibility(item, index)
            : options.visibility;
      }

      upload.push({ file: item.file, path, visibility });
    }

    records.push({
      path,
      name: item.file.name,
      type: item.file.type,
      size: item.file.size,
      visibility,
    });
  });

  return { upload, records };
}

/**
 * Uploads files to S3.
 *
 * Each payload may specify its own storage path and visibility.
 * If not provided, the default path and visibility from the app configuration will be used.
 *
 * Use `createFilePayloads()` to generate upload payloads from
 * `FileWithPreview` objects.
 *
 * @example
 * const { upload, records } = createFilePayloads(filesWithPreview, {
 *   path: (file) => `public-directory/${file.name}`,
 *   visibility: "public",
 * });
 *
 * // Store the generated records in your database.
 * await db.insert(fileTable).values(records);
 *
 * const results = await uploadFiles(upload);
 */
export async function uploadFiles(
  payloads: UploadFilesPayload[],
  options?: UploadFilesOptions,
): Promise<UploadFilesResponse[]> {
  "use server";

  const { s3FileDirectory, s3FileVisibility } = appConfig.default;

  return await Promise.all(
    payloads.map(async (payload) => {
      const Key = payload.path ?? `${s3FileDirectory}/${payload.file.name}`;
      const visibility = payload.visibility ?? s3FileVisibility;

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

/** Create signed URLs for files stored in S3. */
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

/** Create public URLs for files stored in the public S3 bucket. */
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
