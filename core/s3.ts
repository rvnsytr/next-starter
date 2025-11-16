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

const Bucket = process.env.S3_BUCKET_NAME!;
const endpoint = process.env.S3_ENDPOINT!;
const region = { singapore: "ap-southeast-1", jakarta: "ap-southeast-3" };

const s3 = new S3Client({
  endpoint,
  region: region.jakarta,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function uploadFiles({
  files,
  ...props
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
        ...props,
      });

      return { key, res: await s3.send(command) };
    }),
  );
}

export async function getAllFiles(MaxKeys = 1000, ContinuationToken?: string) {
  const param = { Bucket, MaxKeys, ContinuationToken };
  return await s3.send(new ListObjectsV2Command(param));
}

export async function getFileSignedUrl(Key: string) {
  return await getSignedUrl(s3, new GetObjectCommand({ Bucket, Key }));
}

export async function getFilePublicUrl(key: string) {
  return `${endpoint}/${Bucket}/${key}`;
}

export async function extractKeyFromPublicUrl(url: string) {
  const parsed = new URL(url);
  const parts = parsed.pathname.split("/");
  const key = parts.slice(2).join("/");
  return key;
}

export async function deleteFiles(key: string[]) {
  return Promise.all(
    key.map((item) => s3.send(new DeleteObjectCommand({ Bucket, Key: item }))),
  );
}
