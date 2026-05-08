import { file as fileTable } from "@/shared/db/schema";
import {
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  PutObjectCommand,
  type PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FileWithPreview, Override } from "./types";

const S3_PUBLIC_ENDPOINT = process.env.S3_PUBLIC_ENDPOINT!;
const S3_BUCKET = process.env.S3_BUCKET!;
const S3_PUBLIC_BUCKET = process.env.S3_PUBLIC_BUCKET!;

const defaultDir = "global";

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export type FileVisibility = "private" | "public";

type ControlledS3Options<T> = Override<
  Omit<T, "Key" | "Bucket">,
  { visibility: FileVisibility }
>;

export type UploadFilesPayload = { file: File; path?: string };

export type UploadFilesOptions = ControlledS3Options<
  Omit<PutObjectCommandInput, "Body" | "ContentType">
>;

export type UploadFilesResponse = {
  file: Pick<
    typeof fileTable.$inferSelect,
    "path" | "name" | "type" | "size" | "visibility"
  >;
  output: PutObjectCommandOutput;
};

const getBucket = (v: FileVisibility = "private") =>
  v === "public" ? S3_PUBLIC_BUCKET : S3_BUCKET;

export async function uploadFiles(
  payload: UploadFilesPayload[],
  options?: UploadFilesOptions,
): Promise<UploadFilesResponse[]> {
  "use server";
  const visibility = options?.visibility ?? "private";

  return await Promise.all(
    payload.map(async ({ file, path }) => {
      const Key = path ?? `${defaultDir}/${file.name}`;

      const command = new PutObjectCommand({
        Key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        Bucket: getBucket(visibility),
        ...options,
      });

      return {
        file: {
          path: Key,
          name: file.name,
          type: file.type,
          size: file.size,
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
    setPath?: (file: FileWithPreview, index: number) => string;
  },
): {
  upload: UploadFilesPayload[];
  db: (typeof fileTable.$inferInsert)[];
} {
  const upload: UploadFilesPayload[] = [];
  const db: (typeof fileTable.$inferInsert)[] = [];

  files.forEach((item, index) => {
    if (item.file instanceof File) {
      const path = options?.setPath
        ? options.setPath(item, index)
        : `${defaultDir}/${item.file.name}`;

      upload.push({ file: item.file, path });

      db.push({
        path,
        name: item.file.name,
        type: item.file.type,
        size: item.file.size,
      });
    } else db.push(item.file);
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
