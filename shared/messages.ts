import { capitalize, formatBytes, formatLocalizedDate } from "@/core/utils";
import { formatDistanceToNow } from "date-fns";

import { enUS } from "date-fns/locale";

export const messages = {
  actions: {
    // created: "created",
    // removed: "removed",
    // updated: "updated",
    // uploaded: "uploaded",

    action: "Action",
    add: "Add",
    back: "Back",
    cancel: "Cancel",
    clear: "Clear",
    confirm: "Confirm",
    delete: "Delete",
    reset: "Reset",
    save: "Save",
    update: "Save Changes",
    upload: "Upload",

    prev: "Previous",
    next: "Next",
  },

  loading: "Please wait...",
  success: "Success",
  error: "An error occurred",

  empty: "No results found.",
  unauthorized: "Unauthenticated action",
  forbidden: "You do not have permission to perform this action.",

  noChanges: (thing: string) => `No changes were made to ${thing}.`,
  thingNotMatch: (thing: string) =>
    `${capitalize(thing, "first")} does not match - please check again.`,

  thingAgo: (thing: string, time: Date) =>
    `${capitalize(thing, "first")} ${formatDistanceToNow(time, { locale: enUS })} ago.`,
  dateRelative: (time: Date, mode: "future" | "past" = "past") =>
    `${formatLocalizedDate(time, "PPPp")} - ${formatDistanceToNow(time, { locale: enUS })} ${mode === "past" ? "ago" : "from now"}.`,

  // -- Validation
  invalid: (field: string) => `${capitalize(field, "first")} is invalid.`,
  notFound: (field: string) => `${capitalize(field, "first")} was not found.`,

  required: (field: string) => `${capitalize(field, "first")} is required.`,
  requiredInvalidType: (field: string, fieldType: string) =>
    `${capitalize(field, "first")} is required and must be a valid ${fieldType}.`,

  outOfRange: (field: string, min: number, max: number, thing = "characters") =>
    `${capitalize(field, "first")} must be between ${min} and ${max} ${thing}.`.trim(),

  string: {
    tooShort: (field: string, min: number) =>
      `${capitalize(field, "first")} must be at least ${min} characters long.`,
    tooLong: (field: string, max: number) =>
      `${capitalize(field, "first")} must not exceed ${max} characters.`,
  },

  number: {
    tooSmall: (field: string, min: number) =>
      `${capitalize(field, "first")} must not be less than ${min}.`,
    tooLarge: (field: string, max: number) =>
      `${capitalize(field, "first")} must not be greater than ${max}.`,
  },

  array: {
    tooSmall: (field: string, min: number) =>
      `${capitalize(field, "first")} must contain at least ${min} items.`,
    tooLarge: (field: string, max: number) =>
      `${capitalize(field, "first")} must not contain more than ${max} items.`,
  },

  date: {
    tooEarly: (field: string, min: Date) =>
      `${capitalize(field, "first")} must not be earlier than ${formatLocalizedDate(min, "PPP")}.`,
    tooLate: (field: string, max: Date) =>
      `${capitalize(field, "first")} must not be later than ${formatLocalizedDate(max, "PPP")}.`,
    tooFew: (field: string, min: number) =>
      `${capitalize(field, "first")} must contain at least ${min} dates.`,
    tooMany: (field: string, max: number) =>
      `${capitalize(field, "first")} must not contain more than ${max} dates.`,
  },

  files: {
    mimeInvalid: (field: string) => `The ${field} type is invalid.`,
    tooFew: (field: string, min: number) =>
      `Please upload at least ${min} ${field}.`,
    tooMany: (field: string, max: number) =>
      `You can only upload up to ${max} ${field}.`,
    tooLarge: (field: string, size: number) =>
      `${capitalize(field, "first")} exceeds the maximum file size (${formatBytes(size)}).`,
  },

  password: {
    lowercase: "Password must contain an uppercase letter (A-Z).",
    uppercase: "Password must contain a lowercase letter (a-z).",
    number: "Password must contain a number (0-9).",
    character: "Password must contain a special character.",
  },
};

// export const messages = {
//   actions: {
//     // created: "dibuat",
//     // removed: "dihapus",
//     // updated: "diperbarui",
//     // uploaded: "diunggah",

//     action: "Aksi",
//     add: "Tambah",
//     back: "Kembali",
//     cancel: "Batal",
//     clear: "Bersihkan",
//     confirm: "Konfirmasi",
//     delete: "Hapus",
//     reset: "Atur Ulang",
//     save: "Simpan",
//     update: "Simpan Perubahan",
//     upload: "Unggah",

//     prev: "Sebelumnya",
//     next: "Selanjutnya",
//   },

//   loading: "Sedang memuat...",
//   success: "Sukses",
//   error: "Terjadi kesalahan",

//   empty: "Tidak ada hasil yang ditemukan.",
//   unauthorized: "Tindakan tidak terautentikasi",
//   forbidden: "Tidak memiliki izin untuk melakukan tindakan ini.",

//   noChanges: (thing: string) => `Tidak ada perubahan pada ${thing}.`,
//   thingNotMatch: (thing: string) =>
//     `${capitalize(thing, "first")} tidak cocok - silakan periksa kembali.`,

//   thingAgo: (thing: string, time: Date) =>
//     `${capitalize(thing, "first")} ${formatDistanceToNow(time, { locale: id })} yang lalu.`,
//   dateRelative: (time: Date, mode: "future" | "past" = "past") =>
//     `${formatLocalizedDate(time, "PPPp")} - ${formatDistanceToNow(time, { locale: id })} ${mode === "past" ? "yang lalu" : "dari sekarang"}.`,

//   // -- Validation
//   invalid: (field: string) => `${capitalize(field, "first")} tidak valid.`,
//   notFound: (field: string) => `${capitalize(field, "first")} tidak ditemukan.`,

//   required: (field: string) => `${capitalize(field, "first")} wajib diisi.`,
//   requiredInvalidType: (field: string, fieldType: string) =>
//     `${capitalize(field, "first")} wajib diisi dan harus berupa ${fieldType} yang valid.`,

//   outOfRange: (field: string, min: number, max: number, thing = "karakter") =>
//     `${capitalize(field, "first")} harus antara ${min} hingga ${max} ${thing}.`.trim(),

//   string: {
//     tooShort: (field: string, min: number) =>
//       `${capitalize(field, "first")} harus terdiri dari minimal ${min} karakter.`,
//     tooLong: (field: string, max: number) =>
//       `${capitalize(field, "first")} tidak boleh melebihi ${max} karakter.`,
//   },

//   number: {
//     tooSmall: (field: string, min: number) =>
//       `${capitalize(field, "first")} tidak boleh kurang dari ${min}.`,
//     tooLarge: (field: string, max: number) =>
//       `${capitalize(field, "first")} tidak boleh lebih dari ${max}.`,
//   },

//   array: {
//     tooSmall: (field: string, min: number) =>
//       `${capitalize(field, "first")} harus terdiri dari minimal ${min} item.`,
//     tooLarge: (field: string, max: number) =>
//       `${capitalize(field, "first")} tidak boleh melebihi ${max} item.`,
//   },

//   date: {
//     tooEarly: (field: string, min: Date) =>
//       `${capitalize(field, "first")} tidak boleh lebih awal dari ${formatLocalizedDate(min, "PPP")}.`,
//     tooLate: (field: string, max: Date) =>
//       `${capitalize(field, "first")} tidak boleh lebih lambat dari ${formatLocalizedDate(max, "PPP")}.`,
//     tooFew: (field: string, min: number) =>
//       `${capitalize(field, "first")} harus terdiri dari minimal ${min} tanggal.`,
//     tooMany: (field: string, max: number) =>
//       `${capitalize(field, "first")} tidak boleh melebihi ${max} tanggal.`,
//   },

//   files: {
//     mimeInvalid: (field: string) => `Tipe ${field} tidak valid.`,
//     tooFew: (field: string, min: number) =>
//       `Silakan unggah minimal ${min} ${field}.`,
//     tooMany: (field: string, max: number) =>
//       `Anda hanya dapat mengunggah hingga ${max} ${field}.`,
//     tooLarge: (field: string, size: number) =>
//       `${capitalize(field, "first")} melebihi batas ukuran maksimum (${formatBytes(size)}).`,
//   },

//   password: {
//     lowercase: "Kata sandi harus mengandung huruf kapital (A-Z).",
//     uppercase: "Kata sandi harus mengandung huruf kecil (a-z).",
//     number: "Kata sandi harus mengandung angka (0-9).",
//     character: "Kata sandi harus mengandung karakter khusus.",
//   },
// };
