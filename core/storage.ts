"use server";

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
import { Override } from "./constants/types";

const endpoint = process.env.S3_ENDPOINT!;
const defaultBucket = process.env.S3_BUCKET_NAME!;

type ControlledS3Options<T> = Override<Omit<T, "Key">, { Bucket?: string }>;

const s3 = new S3Client({
  endpoint,
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export async function uploadFiles(
  files: File[] | { key: string; file: File }[],
  options?: ControlledS3Options<
    Omit<PutObjectCommandInput, "Body" | "ContentType">
  >,
): Promise<{ key: string; res: PutObjectCommandOutput }[]> {
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
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        ...options,
        Bucket: options?.Bucket ?? defaultBucket,
      });

      return { key, res: await s3.send(command) };
    }),
  );
}

export async function getAllFiles(
  options?: Override<ListObjectsV2CommandInput, { Bucket?: string }>,
) {
  const command = new ListObjectsV2Command({
    ...options,
    Bucket: options?.Bucket ?? defaultBucket,
  });

  return await s3.send(command);
}

export async function getFilePresignedUrl(
  Key: string,
  options?: ControlledS3Options<GetObjectCommandInput>,
) {
  const command = new GetObjectCommand({
    Key,
    ...options,
    Bucket: options?.Bucket ?? defaultBucket,
  });

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

export async function removeFiles(
  keys: string[],
  options?: ControlledS3Options<DeleteObjectCommandInput>,
) {
  return Promise.all(
    keys.map(async (Key) => {
      const command = new DeleteObjectCommand({
        Key,
        ...options,
        Bucket: options?.Bucket ?? defaultBucket,
      });

      return await s3.send(command);
    }),
  );
}
