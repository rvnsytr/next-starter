"use server";

import { auth } from "@/core/auth";
import { removeFiles } from "@/core/storage";
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
      async (userId) =>
        await auth.api.revokeUserSessions({
          body: { userId },
          headers: await headers(),
        }),
    ),
  );
}

export async function removeUsers(
  data: Pick<AuthSession["user"], "id" | "image">[],
) {
  return Promise.all(
    data.map(async ({ id, image }) => {
      if (image) await removeFiles([image], { isPublicUrl: true });
      return await auth.api.removeUser({
        body: { userId: id },
        headers: await headers(),
      });
    }),
  );
}
