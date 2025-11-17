"use server";

import { auth } from "@/core/auth";
import { routesMeta } from "@/core/constants";
import { deleteFiles, extractKeyFromPublicUrl } from "@/core/s3";
import { UserWithRole } from "better-auth/plugins";
import { Route } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Role } from "./constants";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function getUserList() {
  return await auth.api.listUsers({
    headers: await headers(),
    query: { sortBy: "createdAt", sortDirection: "desc" },
  });
}

export async function getSessionList() {
  return await auth.api.listSessions({ headers: await headers() });
}

export async function requireAuth(route: Route) {
  const meta = routesMeta[route];
  if (!meta.role) notFound();

  const session = await getSession();
  if (!session) notFound();

  const isAuthorized =
    meta.role &&
    (meta.role === "all" || meta.role.includes(session.user.role as Role));

  if (!isAuthorized) notFound();

  return { session, meta };
}

export async function revokeUserSessions(ids: string[]) {
  return Promise.all(
    ids.map(async (id) => {
      return await auth.api.revokeUserSessions({
        body: { userId: id },
        headers: await headers(),
      });
    }),
  );
}

export async function deleteProfilePicture(image: string) {
  await deleteFiles([await extractKeyFromPublicUrl(image)]);
}

export async function deleteUsers(data: Pick<UserWithRole, "id" | "image">[]) {
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
