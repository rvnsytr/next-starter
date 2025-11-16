import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { id } from "date-fns/locale";

const locale = id;

export function isDateInRange(from: Date, to: Date, date: Date) {
  return isBefore(from, date) && isAfter(to, date);
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
