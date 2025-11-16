import { capitalize, formatDate, formatDateDistanceToNow } from "@/core/utils";

export const messages = {
  actions: {
    // created: "dibuat",
    // removed: "dihapus",
    // updated: "diperbarui",
    // uploaded: "diunggah",

    action: "Tindakan",
    add: "Tambah",
    back: "Kembali",
    cancel: "Batal",
    clear: "Bersihkan",
    confirm: "Konfirmasi",
    refresh: "Muat Ulang",
    remove: "Hapus",
    reset: "Atur Ulang",
    save: "Simpan",
    update: "Simpan Perubahan",
    upload: "Unggah",
    view: "Lihat",
  },

  empty: "Tidak ada hasil yang ditemukan.",
  loading: "Mohon tunggu sebentar...",

  error: "Terjadi kesalahan. Silakan coba lagi nanti.",
  notAuthorized: "Anda tidak memiliki izin untuk melakukan tindakan ini.",

  removeLabel: (thing: string) =>
    `Untuk mengonfirmasi, ketik "${thing}" pada kolom di bawah ini.`,

  noChanges: (thing: string) => `Tidak ada perubahan pada ${thing}.`,
  thingNotMatch: (thing: string) =>
    `${capitalize(thing, "first")} tidak cocok - silakan periksa kembali.`,

  thingAgo: (thing: string, time: Date) =>
    `${capitalize(thing, "first")} ${formatDateDistanceToNow(time)} yang lalu.`,
  dateAgo: (time: Date) =>
    `${formatDate(time, "PPPp")} - ${formatDateDistanceToNow(time)} yang lalu.`,

  // -- Validation
  invalid: (field: string) => `Masukkan ${field.toLowerCase()} yang valid.`,
  invalidType: (field: string, fieldType: string) =>
    `${capitalize(field, "first")} harus berupa ${fieldType} yang valid.`,

  required: (field: string) => `${capitalize(field, "first")} wajib diisi.`,
  requiredInvalidType: (field: string, fieldType: string) =>
    `${capitalize(field, "first")} wajib diisi dan harus berupa ${fieldType} yang valid.`,

  stringLength: (field: string, min: number) =>
    `${capitalize(field, "first")} harus terdiri dari ${min} karakter.`,
  stringTooShort: (field: string, min: number) =>
    `${capitalize(field, "first")} harus terdiri dari minimal ${min} karakter.`,
  stringTooLong: (field: string, max: number) =>
    `${capitalize(field, "first")} tidak boleh melebihi ${max} karakter.`,

  numberTooSmall: (field: string, min: number) =>
    `${capitalize(field, "first")} tidak boleh kurang dari ${min}.`,
  numberTooLarge: (field: string, max: number) =>
    `${capitalize(field, "first")} tidak boleh lebih dari ${max}.`,

  dateToFew: (field: string, min: number) =>
    `${capitalize(field, "first")} harus terdiri dari minimal ${min} tanggal.`,
  dateTooMany: (field: string, max: number) =>
    `${capitalize(field, "first")} tidak boleh melebihi ${max} tanggal.`,

  fileToFew: (field: string, min: number) =>
    `Silakan unggah minimal ${min} ${field}.`,
  fileTooMany: (field: string, max: number) =>
    `Anda hanya dapat mengunggah hingga ${max} ${field}.`,
  fileTooLarge: (field: string, sizeInMb: string | number) =>
    `${capitalize(field, "first")} melebihi batas ukuran maksimum ${sizeInMb} MB.`,

  outOfRange: (
    field: string,
    min: number,
    max: number,
    thing: string = "karakter",
  ) =>
    `${capitalize(field, "first")} harus antara ${min} hingga ${max} ${thing}.`.trim(),
};
