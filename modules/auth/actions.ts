"use server";

import { auth } from "@/core/auth";
import { deleteFiles, extractKeyFromPublicUrl } from "@/core/s3";
import { headers } from "next/headers";
import { AuthSession } from "./constants";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function getSessionList() {
  return await auth.api.listSessions({ headers: await headers() });
}

export async function getUserList() {
  return await auth.api.listUsers({
    headers: await headers(),
    query: { sortBy: "createdAt", sortDirection: "desc" },
  });
}

export async function revokeUserSessions(ids: string[]) {
  return Promise.all(
    ids.map(
      async (id) =>
        await auth.api.revokeUserSessions({
          body: { userId: id },
          headers: await headers(),
        }),
    ),
  );
}

export async function deleteProfilePicture(image: string) {
  await deleteFiles([await extractKeyFromPublicUrl(image)]);
}

export async function deleteUsers(
  data: Pick<AuthSession["user"], "id" | "image">[],
) {
  return Promise.all(
    data.map(async ({ id, image }) => {
      if (image) await deleteProfilePicture(image);
      return await auth.api.removeUser({
        body: { userId: id },
        headers: await headers(),
      });
    }),
  );
}
