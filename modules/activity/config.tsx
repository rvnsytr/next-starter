import { ActivityWithEntity } from "@/shared/db/schema";
import {
  LucideIcon,
  PlusCircleIcon,
  UserRoundCheckIcon,
  UserRoundCogIcon,
  UserRoundPenIcon,
  UserRoundPlusIcon,
  UserRoundXIcon,
  UserSquare2Icon,
} from "lucide-react";
import { ActivityType } from "./schema";

type ActivityConfigMetadata = {
  label: string;
  description: React.ReactNode;
  icon: LucideIcon;
  color?: string;
};

type ActivityConfigContext = Pick<ActivityWithEntity, "data" | "entity">;

export const activityConfig: Record<
  ActivityType,
  | ActivityConfigMetadata
  | ((ctx?: ActivityConfigContext) => ActivityConfigMetadata)
> = {
  "user-created": {
    label: "Akun Dibuat",
    description: "Akun berhasil dibuat dan ditambahkan ke dalam sistem.",
    icon: PlusCircleIcon,
    color: "var(--color-success)",
  },
  // "user-imported": {
  //   label: "Akun Diimpor",
  //   description: "Akun berhasil dimuat melalui loader ke dalam sistem.",
  //   icon: PlusCircleIcon,
  //   color: "var(--color-success)",
  // },
  // "user-verified": {
  //   label: "Akun Diverifikasi",
  //   description:
  //     "Pengguna memverifikasi akun melalui email dan dapat mengakses sistem.",
  //   icon: UserRoundCheckIcon,
  //   color: "var(--color-success)",
  // },
  "user-role-updated": (c) => ({
    label: "Role Akun Diperbarui",
    description: (
      <span>
        Role akun diperbarui menjadi <b>{c?.data}</b>.
      </span>
    ),
    icon: UserRoundCogIcon,
    color: "var(--color-info)",
  }),
  "user-banned": {
    label: "Akun Diblokir",
    description: "Pengguna diblokir dan tidak dapat mengakses sistem.",
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
  },
  "user-unbanned": {
    label: "Blokir Akun Dicabut",
    description: "Blokir pada akun dicabut dan akses telah dipulihkan.",
    icon: UserRoundCheckIcon,
    color: "var(--color-foreground)",
  },
  // "user-deleted": {
  //   label: "Akun Dihapus",
  //   description: "Akun dihapus dari sistem.",
  //   icon: Trash2Icon,
  //   color: "var(--color-destructive)",
  // },

  // "password-reset": {
  //   label: "Kata Sandi Diatur Ulang",
  //   description: (
  //     <span>
  //       Kata sandi diatur ulang melalui fitur <b>Lupa Kata Sandi</b>.
  //     </span>
  //   ),
  //   icon: LockKeyholeOpenIcon,
  //   color: "var(--foreground)",
  // },
  // "password-changed": {
  //   label: "Kata Sandi Diperbarui",
  //   description: (
  //     <span>
  //       Kata sandi diperbarui melalui fitur <b>Ubah Kata Sandi</b>.
  //     </span>
  //   ),
  //   icon: LockKeyholeOpenIcon,
  //   color: "var(--foreground)",
  // },

  "profile-updated": {
    label: "Profil Diperbarui",
    description: "Pengguna memperbarui informasi profil.",
    icon: UserRoundPenIcon,
    color: "var(--foreground)",
  },
  "profile-image-updated": {
    label: "Foto Profil Diperbarui",
    description: "Pengguna memperbarui foto profil.",
    icon: UserSquare2Icon,
    color: "var(--foreground)",
  },

  "admin-user-create": (c) => ({
    label: "Admin Menambahkan Akun",
    description: (
      <span>
        Admin menambahkan akun atas nama <b>{c?.entity}</b> ke dalam sistem.
      </span>
    ),
    icon: UserRoundPlusIcon,
    color: "var(--color-success)",
  }),
  // "admin-user-import": (c) => ({
  //   label: "Mengimpor Akun",
  //   description: (
  //     <span>
  //       Mengimpor <b>{c?.data} akun</b> ke dalam sistem melalui fitur{" "}
  //       <b>Import User</b>.
  //     </span>
  //   ),
  //   icon: ImportIcon,
  //   color: "var(--color-info)",
  // }),
  "admin-user-update-role": (c) => ({
    label: "Admin Mengubah Peran",
    description: (
      <span>
        Admin mengubah peran akun <b>{c?.entity}</b>.
      </span>
    ),
    icon: UserRoundCogIcon,
    color: "var(--color-info)",
  }),
  "admin-user-ban": (c) => ({
    label: "Admin Memblokir Akun",
    description: (
      <span>
        Admin memblokir akun atas nama <b>{c?.entity}</b> dengan alasan{" "}
        <b>{c?.data}</b>.
      </span>
    ),
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
  }),
  "admin-user-unban": (c) => ({
    label: "Admin Membuka Blokir Akun",
    description: (
      <span>
        Admin membuka blokir akun atas nama <b>{c?.entity}</b>.
      </span>
    ),
    icon: UserRoundCheckIcon,
    color: "var(--color-foreground)",
  }),
  "admin-user-delete": (c) => ({
    label: "Admin Menghapus Akun",
    description: (
      <span>
        Admin menghapus akun atas nama <b>{c?.entity}</b> dari sistem.
      </span>
    ),
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
  }),
  "admin-users-delete": (c) => ({
    label: "Admin Menghapus Banyak Akun",
    description: (
      <span>
        Admin menghapus <b>{c?.data} akun</b> dari sistem.
      </span>
    ),
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
  }),
};

export function getActivityConfig(
  type: ActivityType,
  ctx?: ActivityConfigContext,
) {
  const config = activityConfig[type];
  return typeof config === "function" ? config(ctx) : config;
}
