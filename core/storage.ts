"use server";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type PutObjectCommandInput,
  type PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.S3_ENDPOINT!;
const Bucket = process.env.S3_BUCKET_NAME!;

const s3 = new S3Client({
  endpoint,
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export async function uploadFiles({
  files,
  ...options
}: Omit<PutObjectCommandInput, "Key" | "Bucket" | "Body" | "ContentType"> & {
  files: File[] | { key: string; file: File }[];
}): Promise<{ key: string; res: PutObjectCommandOutput }[]> {
  return Promise.all(
    files.map(async (item) => {
      let key: string;
      let file: File;

      if ("key" in item && "file" in item) {
        key = item.key;
        file = item.file;
      } else {
        key = item.name;
        file = item;
      }

      const command = new PutObjectCommand({
        Key: key,
        Bucket,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        ...options,
      });

      return { key, res: await s3.send(command) };
    }),
  );
}

export async function getAllFiles(MaxKeys = 1000, ContinuationToken?: string) {
  const param = { Bucket, MaxKeys, ContinuationToken };
  return await s3.send(new ListObjectsV2Command(param));
}

export async function getFilePresignedUrl(Key: string) {
  return await getSignedUrl(s3, new GetObjectCommand({ Bucket, Key }));
}

export async function getFilePublicUrl(key: string) {
  return `${endpoint}/${Bucket}/${encodeURIComponent(key)}`;
}

export async function getKeyFromPublicUrl(url: string) {
  const { pathname } = new URL(url);
  const [, bucket, ...keyParts] = pathname.split("/");
  if (bucket !== Bucket) throw new Error("URL does not belong to this bucket");
  return decodeURIComponent(keyParts.join("/"));
}

export async function removeFiles(
  keys: string[],
  options?: { isPublicUrl?: boolean },
) {
  return Promise.all(
    keys.map(async (item) => {
      const Key = options?.isPublicUrl ? await getKeyFromPublicUrl(item) : item;
      await s3.send(new DeleteObjectCommand({ Bucket, Key }));
    }),
  );
}
