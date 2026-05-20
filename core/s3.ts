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

const defaultDir = "global";
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

type ControlledS3Options<T> = Override<
  Omit<T, "Key" | "Bucket">,
  {
    /** The visibility of the file. default to `private` */
    visibility?: FileVisibility;
  }
>;

export type UploadFilesPayload = {
  file: File;
  path?: string;
  /** Will override `uploadFiles` visibility option */
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

export async function uploadFiles(
  payloads: UploadFilesPayload[],
  options?: UploadFilesOptions,
): Promise<UploadFilesResponse[]> {
  "use server";

  return await Promise.all(
    payloads.map(async (payload) => {
      const Key = payload.path ?? `${defaultDir}/${payload.file.name}`;

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

export function prepareFiles(
  files: FileWithPreview[],
  options?: {
    visibility?: FileVisibility;
    setPath?: (file: FileWithPreview, index: number) => string;
  },
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
        : `${defaultDir}/${item.file.name}`;
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
