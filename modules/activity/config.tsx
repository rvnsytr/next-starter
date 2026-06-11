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
import { DeletedEntityIcon } from "./components/deleted-entity-icon";
import { ActivityType } from "./schema";

type ActivityConfigMetadata = {
  label: string;
  description: React.ReactNode;
  icon: LucideIcon;
  color?: string;
  textColor?: string;
};

type ActivityConfigContext = Pick<ActivityWithEntity, "data" | "entity">;

export const activityTypeConfig: Record<
  ActivityType,
  | ActivityConfigMetadata
  | ((ctx?: ActivityConfigContext) => ActivityConfigMetadata)
> = {
  // "user-registered": {
  //   label: "Akun Terdaftar",
  //   description: "Pengguna berhasil mendaftar dan membuat akun baru.",
  //   icon: UserRoundCheckIcon,
  //   color: "var(--color-success)",
  //   textColor: "var(--color-success-foreground)",
  // },
  "user-created": {
    label: "Akun Dibuat",
    description: "Akun berhasil dibuat dan ditambahkan ke dalam sistem.",
    icon: PlusCircleIcon,
    color: "var(--color-success)",
    textColor: "var(--color-success-foreground)",
  },
  // "user-imported": {
  //   label: "Akun Diimpor",
  //   description: "Akun berhasil dimuat melalui loader ke dalam sistem.",
  //   icon: PlusCircleIcon,
  //   color: "var(--color-success)",
  //   textColor: "var(--color-success-foreground)",
  // },
  // "user-activated": {
  //   label: "Akun Diaktivasi",
  //   description:
  //     "Pengguna mengaktifkan akunnya dan melanjutkan ke proses verifikasi.",
  //   icon: UserRoundCheckIcon,
  //   color: "var(--color-success)",
  // },
  // "user-verified": {
  //   label: "Akun Diverifikasi",
  //   description:
  //     "Pengguna memverifikasi akun melalui email dan dapat mengakses sistem.",
  //   icon: UserRoundCheckIcon,
  //   color: "var(--color-success)",
  //   textColor: "var(--color-success-foreground)",
  // },
  "user-role-updated": (c) => ({
    label: "Role Akun Diperbarui",
    description: (
      <>
        Role akun diperbarui menjadi <b>{c?.data}</b>.
      </>
    ),
    icon: UserRoundCogIcon,
    color: "var(--color-info)",
    textColor: "var(--color-info-foreground)",
  }),
  "user-banned": {
    label: "Akun Diblokir",
    description: "Pengguna diblokir dan tidak dapat mengakses sistem.",
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
    textColor: "var(--color-destructive-foreground)",
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
  //     <>
  //       Kata sandi diatur ulang melalui fitur <b>Lupa Kata Sandi</b>.
  //     </>
  //   ),
  //   icon: LockKeyholeOpenIcon,
  //   color: "var(--foreground)",
  // },
  // "password-changed": {
  //   label: "Kata Sandi Diperbarui",
  //   description: (
  //     <>
  //       Kata sandi diperbarui melalui fitur <b>Ubah Kata Sandi</b>.
  //     </>
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
      <>
        Admin menambahkan akun atas nama{" "}
        {c?.entity ? <b>{c.entity}</b> : <DeletedEntityIcon />} ke dalam sistem.
      </>
    ),
    icon: UserRoundPlusIcon,
    color: "var(--color-success)",
    textColor: "var(--color-success-foreground)",
  }),
  // "admin-user-import": (c) => ({
  //   label: "Mengimpor Akun",
  //   description: (
  //     <>
  //       Mengimpor <b>{c?.data} akun</b> ke dalam sistem melalui fitur{" "}
  //       <b>Import User</b>.
  //     </>
  //   ),
  //   icon: ImportIcon,
  //   color: "var(--color-info)",
  // }),
  "admin-user-update-role": (c) => ({
    label: "Admin Mengubah Role",
    description: (
      <>
        Admin mengubah role akun atas nama{" "}
        {c?.entity ? <b>{c.entity}</b> : <DeletedEntityIcon />} menjadi{" "}
        <b>{c?.data}</b>.
      </>
    ),
    icon: UserRoundCogIcon,
    color: "var(--color-info)",
    textColor: "var(--color-info-foreground)",
  }),
  "admin-user-ban": (c) => ({
    label: "Admin Memblokir Akun",
    description: (
      <>
        Admin memblokir akun atas nama{" "}
        {c?.entity ? <b>{c.entity}</b> : <DeletedEntityIcon />}.
      </>
    ),
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
    textColor: "var(--color-destructive-foreground)",
  }),
  "admin-user-unban": (c) => ({
    label: "Admin Membuka Blokir Akun",
    description: (
      <>
        Admin membuka blokir akun atas nama{" "}
        {c?.entity ? <b>{c.entity}</b> : <DeletedEntityIcon />}.
      </>
    ),
    icon: UserRoundCheckIcon,
    color: "var(--color-foreground)",
  }),
  "admin-user-delete": (c) => ({
    label: "Admin Menghapus Akun",
    description: (
      <>
        Admin menghapus akun atas nama <b>{c?.data}</b> dari sistem.
      </>
    ),
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
    textColor: "var(--color-destructive-foreground)",
  }),
  "admin-users-delete": (c) => ({
    label: "Admin Menghapus Banyak Akun",
    description: (
      <>
        Admin menghapus <b>{c?.data} akun</b> dari sistem.
      </>
    ),
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
    textColor: "var(--color-destructive-foreground)",
  }),
};

export function getActivityTypeConfig(
  type: ActivityType,
  ctx?: ActivityConfigContext,
) {
  const config = activityTypeConfig[type];
  return typeof config === "function" ? config(ctx) : config;
}
