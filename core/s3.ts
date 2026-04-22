"use server";

import { files } from "@/shared/db/schema";
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  PutObjectCommand,
  type PutObjectCommandInput,
  type PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgAsyncTransaction } from "drizzle-orm/pg-core";
import { db } from "./db";
import { Override } from "./types";

const endpoint = process.env.S3_ENDPOINT!;
const defaultBucket = process.env.S3_BUCKET_NAME!;
const defaultDir = "global";

const s3 = new S3Client({
  endpoint,
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

type ControlledS3Options<T> = Override<Omit<T, "Key">, { Bucket?: string }>;

type UploadFilesOptions = ControlledS3Options<
  Omit<PutObjectCommandInput, "Body" | "ContentType">
>;

type DeleteFilesOptions = ControlledS3Options<DeleteObjectCommandInput>;

export type UploadFilesPayload = { file: File; path?: string };

export async function uploadFiles(
  payload: UploadFilesPayload[],
  options?: UploadFilesOptions & {
    tx?: PgAsyncTransaction<NodePgQueryResultHKT>;
  },
): Promise<
  {
    file: typeof files.$inferSelect;
    output: PutObjectCommandOutput;
  }[]
> {
  const { tx = db, Bucket = defaultBucket, ...rest } = options ?? {};

  const uploadRes = await Promise.all(
    payload.map(async ({ file, path }) => {
      const key = path ?? `${defaultDir}/${file.name}`;
      const command = new PutObjectCommand({
        Key: key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        Bucket,
        ...rest,
      });
      return { key, file, output: await s3.send(command) };
    }),
  );

  const filesPayload: (typeof files.$inferInsert)[] = uploadRes.map((f) => ({
    file_path: f.key,
    file_name: f.file.name,
    file_type: f.file.type,
    file_size: f.file.size,
  }));

  const dbRes = await tx.insert(files).values(filesPayload).returning();
  return dbRes.map((file, i) => ({ file, output: uploadRes[i].output }));
}

export async function listFiles(
  options?: Override<ListObjectsV2CommandInput, { Bucket?: string }>,
) {
  const { Bucket = defaultBucket, ...rest } = options ?? {};
  const command = new ListObjectsV2Command({ Bucket, ...rest });
  return await s3.send(command);
}

export async function createSignedUrl(
  path: string,
  options?: ControlledS3Options<GetObjectCommandInput>,
) {
  const { Bucket = defaultBucket, ...rest } = options ?? {};
  const command = new GetObjectCommand({ Key: path, Bucket, ...rest });
  return await getSignedUrl(s3, command);
}

// export async function getFilePublicUrl(key: string) {
//   return `${endpoint}/${Bucket}/${encodeURIComponent(key)}`;
// }

// export async function getKeyFromPublicUrl(url: string) {
//   const { pathname } = new URL(url);
//   const [, bucket, ...keyParts] = pathname.split("/");
//   if (bucket !== Bucket) throw new Error("URL does not belong to this bucket");
//   return decodeURIComponent(keyParts.join("/"));
// }

export async function deleteFiles(
  paths: string[],
  options?: DeleteFilesOptions,
) {
  const { Bucket = defaultBucket, ...rest } = options ?? {};
  return Promise.all(
    paths.map(async (Key) => {
      const command = new DeleteObjectCommand({ Key, Bucket, ...rest });
      return await s3.send(command);
    }),
  );
}
