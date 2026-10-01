import { User } from "@/core/auth";
import { UserStatus } from "./constants/user-status";

export function getUserStatus(
  data: Pick<User, "email" | "emailVerified" | "banned">,
): UserStatus {
  if (data.banned) return "banned";
  if (data.emailVerified) return "verified";
  if (!data.email) return "nonactive";
  return "active";
}
