import {
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  isValid,
  parse,
  set,
} from "date-fns";
import { id } from "date-fns/locale";

const locale = id;

export function sanitizeDate(str: string) {
  const digits = str.replace(/\D/g, "");
  if (digits.length <= 8) return digits;
  return digits.slice(0, 7) + digits[digits.length - 1];
}

export function formatDDMMYY(str: string) {
  const digits = str.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.replace(/^(\d{2})(\d{1,2})/, "$1/$2");
  return digits.replace(/^(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
}

export function parseDDMMYYYY(str: string) {
  const digits = sanitizeDate(str);
  if (digits.length !== 8) return;
  const formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  const parsed = parse(formatted, "dd/MM/yyyy", new Date());
  return isValid(parsed) ? parsed : undefined;
}

export function formatDate(date: Date, formatStr: string) {
  return format(date, formatStr, { locale });
}

export function formatDateDistanceToNow(date: Date) {
  return formatDistanceToNow(date, { locale });
}

export function formatSecondsToDHMS(totalSeconds: number) {
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export function isDateInRange(from: Date, to: Date, date: Date) {
  return isBefore(from, date) && isAfter(to, date);
}

export function mergeDateAndTime(date: Date, time: Date) {
  return set(date, {
    hours: time.getHours(),
    minutes: time.getMinutes(),
    seconds: time.getSeconds(),
    milliseconds: time.getMilliseconds(),
  });
}
