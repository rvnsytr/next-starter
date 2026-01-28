import { capitalize, formatDate, formatDateDistanceToNow } from "../utils";

export const messages = {
  actions: {
    // created: "dibuat",
    // removed: "dihapus",
    // updated: "diperbarui",
    // uploaded: "diunggah",

    action: "Aksi",
    add: "Tambah",
    back: "Kembali",
    cancel: "Batal",
    clear: "Bersihkan",
    confirm: "Konfirmasi",
    remove: "Hapus",
    reset: "Atur Ulang",
    save: "Simpan",
    update: "Simpan Perubahan",
    upload: "Unggah",

    prev: "Sebelumnya",
    next: "Selanjutnya",
  },

  loading: "Mohon tunggu sebentar...",
  empty: "Tidak ada hasil yang ditemukan.",
  notFound: "Sumber daya yang diminta tidak ditemukan.",

  error: "Terjadi kesalahan. Silakan coba lagi nanti.",

  unauthorized: "Tindakan tidak terautentikasi",
  forbidden: "Tidak memiliki izin untuk melakukan tindakan ini.",

  removeLabel: (thing: string) =>
    `Untuk mengonfirmasi, ketik "${thing}" pada kolom di bawah ini.`,

  noChanges: (thing: string) => `Tidak ada perubahan pada ${thing}.`,
  thingNotMatch: (thing: string) =>
    `${capitalize(thing, "first")} tidak cocok - silakan periksa kembali.`,

  thingAgo: (thing: string, time: Date) =>
    `${capitalize(thing, "first")} ${formatDateDistanceToNow(time)} yang lalu.`,
  dateRelative: (time: Date, mode: "future" | "past" = "past") =>
    `${formatDate(time, "PPPp")} - ${formatDateDistanceToNow(time)} ${mode === "past" ? "yang lalu" : "dari sekarang"}.`,

  // -- Validation
  invalid: (field: string) => `${capitalize(field, "first")} tidak valid.`,

  required: (field: string) => `${capitalize(field, "first")} wajib diisi.`,
  requiredInvalidType: (field: string, fieldType: string) =>
    `${capitalize(field, "first")} wajib diisi dan harus berupa ${fieldType} yang valid.`,

  outOfRange: (field: string, min: number, max: number, thing = "karakter") =>
    `${capitalize(field, "first")} harus antara ${min} hingga ${max} ${thing}.`.trim(),

  string: {
    tooShort: (field: string, min: number) =>
      `${capitalize(field, "first")} harus terdiri dari minimal ${min} karakter.`,
    tooLong: (field: string, max: number) =>
      `${capitalize(field, "first")} tidak boleh melebihi ${max} karakter.`,
  },

  number: {
    tooSmall: (field: string, min: number) =>
      `${capitalize(field, "first")} tidak boleh kurang dari ${min}.`,
    tooLarge: (field: string, max: number) =>
      `${capitalize(field, "first")} tidak boleh lebih dari ${max}.`,
  },

  date: {
    tooEarly: (field: string, min: Date) =>
      `${capitalize(field, "first")} tidak boleh lebih awal dari ${formatDate(min, "PPP")}.`,
    tooLate: (field: string, max: Date) =>
      `${capitalize(field, "first")} tidak boleh lebih lambat dari ${formatDate(max, "PPP")}.`,
    tooFew: (field: string, min: number) =>
      `${capitalize(field, "first")} harus terdiri dari minimal ${min} tanggal.`,
    tooMany: (field: string, max: number) =>
      `${capitalize(field, "first")} tidak boleh melebihi ${max} tanggal.`,
  },

  files: {
    mimeInvalid: (field: string) => `Tipe ${field} tidak valid.`,
    tooFew: (field: string, min: number) =>
      `Silakan unggah minimal ${min} ${field}.`,
    tooMany: (field: string, max: number) =>
      `Anda hanya dapat mengunggah hingga ${max} ${field}.`,
    tooLarge: (field: string, sizeInMb: string | number) =>
      `${capitalize(field, "first")} melebihi batas ukuran maksimum ${sizeInMb} MB.`,
  },

  password: {
    lowercase: "Kata sandi harus mengandung huruf kapital (A-Z).",
    uppercase: "Kata sandi harus mengandung huruf kecil (a-z).",
    number: "Kata sandi harus mengandung angka (0-9).",
    character: "Kata sandi harus mengandung karakter khusus.",
  },
};
