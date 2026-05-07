"use server";

import { file } from "@/shared/db/schema";
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
import { Override } from "./types";

const endpoint = {
  private: process.env.S3_ENDPOINT!,
  public: process.env.S3_PUBLIC_ENDPOINT!,
};

const bucket = {
  private: process.env.S3_BUCKET!,
  public: process.env.S3_PUBLIC_BUCKET!,
};

const defaultDir = "global";

const s3 = new S3Client({
  endpoint: endpoint.private,
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
    typeof file.$inferSelect,
    "filePath" | "fileName" | "mimeType" | "fileSize" | "visibility"
  >;
  output: PutObjectCommandOutput;
};

export async function uploadFiles(
  payload: UploadFilesPayload[],
  options?: UploadFilesOptions,
): Promise<UploadFilesResponse[]> {
  const visibility = options?.visibility ?? "private";

  return await Promise.all(
    payload.map(async ({ file, path }) => {
      const Key = path ?? `${defaultDir}/${file.name}`;

      const command = new PutObjectCommand({
        Key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        Bucket: bucket[visibility],
        ...options,
      });

      return {
        file: {
          filePath: Key,
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
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
  const Bucket = bucket[options?.visibility ?? "private"];
  const command = new ListObjectsV2Command({ Bucket, ...options });
  return await s3.send(command);
}

export async function createSignedUrls(
  filePaths: string[],
  options?: ControlledS3Options<GetObjectCommandInput>,
) {
  const Bucket = bucket[options?.visibility ?? "private"];
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

export async function createPublicUrls(filePaths: string[]) {
  return filePaths.map((filePath) => {
    return `${endpoint.public}/${bucket.public}/${encodeURIComponent(filePath)}`;
  });
}

export async function deleteFiles(
  filePaths: string[],
  options?: ControlledS3Options<Omit<DeleteObjectsCommandInput, "Delete">>,
) {
  if (!filePaths.length) return [];

  const Bucket = bucket[options?.visibility ?? "private"];
  const command = new DeleteObjectsCommand({
    Bucket,
    Delete: { Objects: filePaths.map((Key) => ({ Key })), Quiet: false },
    ...options,
  });

  return await s3.send(command);
}
