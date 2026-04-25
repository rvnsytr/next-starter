"use server";

import { auth, AuthSession } from "@/core/auth";
import { db } from "@/core/db";
import { deleteFiles, uploadFiles } from "@/core/s3";
import { ActionResponse } from "@/core/types";
import { files, user } from "@/shared/db/schema";
import { Role } from "@/shared/permission";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers as nextHeaders } from "next/headers";

export async function getSession() {
  return await auth.api.getSession({ headers: await nextHeaders() });
}

export async function updateProfileName(name: string) {
  const res = await auth.api.updateUser({
    headers: await nextHeaders(),
    body: { name },
  });
  revalidatePath("/dashboard/profile");
  return res;
}

export async function updateProfilePicture(
  file: File,
  userId: string,
): Promise<ActionResponse> {
  const res = await db.transaction(async (tx) => {
    const [{ fileId }] = await tx
      .select({ fileId: user.image })
      .from(user)
      .where(eq(user.id, userId));

    if (fileId) {
      const [{ filePath }] = await tx
        .delete(files)
        .where(eq(files.id, fileId))
        .returning({ filePath: files.file_path });
      if (filePath) await deleteFiles([filePath]);
    }

    const [uploadRes] = await uploadFiles([{ file, path: `avatar/${userId}` }]);
    const [insertRes] = await tx
      .insert(files)
      .values(uploadRes.file)
      .returning();

    return await auth.api.updateUser({
      headers: await nextHeaders(),
      body: { image: insertRes.id },
    });
  });

  revalidatePath("/dashboard/profile");
  return { success: res.status };
}

export async function deleteProfilePicture(
  userId: string,
): Promise<ActionResponse> {
  const res = await db.transaction(async (tx) => {
    const [{ fileId }] = await tx
      .select({ fileId: user.image })
      .from(user)
      .where(eq(user.id, userId));

    if (fileId) {
      const [{ filePath }] = await tx
        .delete(files)
        .where(eq(files.id, fileId))
        .returning({ filePath: files.file_path });
      if (filePath) await deleteFiles([filePath]);
    }

    return await auth.api.updateUser({
      headers: await nextHeaders(),
      body: { image: null },
    });
  });

  revalidatePath("/dashboard/profile");
  return { success: res.status };
}

export async function createUser(body: {
  email: string;
  password: string;
  name: string;
  role: Role;
}) {
  const res = await auth.api.createUser({ headers: await nextHeaders(), body });
  revalidatePath("/dashboard/users");
  return res;
}

export async function listSessions() {
  return await auth.api.listSessions({ headers: await nextHeaders() });
}

export async function listUserSessions(userId: string) {
  const { sessions } = await auth.api.listUserSessions({
    headers: await nextHeaders(),
    body: { userId },
  });
  return sessions as AuthSession["session"][];
}

export async function revokeUserSessions(ids: string[]) {
  const headers = await nextHeaders();
  return Promise.all(
    ids.map(
      async (userId) =>
        await auth.api.revokeUserSessions({ body: { userId }, headers }),
    ),
  );
}

export async function removeUsers(
  data: Pick<AuthSession["user"], "id" | "image">[],
) {
  const headers = await nextHeaders();
  return Promise.all(
    data.map(async ({ id, image }) => {
      if (image) await deleteFiles([image]);
      return await auth.api.removeUser({ body: { userId: id }, headers });
    }),
  );
}
