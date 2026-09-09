import { constructFilterFn } from "@tanstack/react-table";
import {
  endOfDay,
  isEqual,
  isWithinInterval,
  startOfDay,
  startOfMinute,
} from "date-fns";
import { z } from "zod";
import { temporalFilterSchema } from "./schema";

export const filterFn_arrExactlyMatches = constructFilterFn({
  filter: (dataValue: string[], filterValue: string[]) => {
    if (!Array.isArray(dataValue)) return false;
    if (dataValue.length !== filterValue.length) return false;
    for (const value of filterValue)
      if (!dataValue.includes(value)) return false;
    return true;
  },
  autoRemove: (v) => !v?.length,
});

type TemporalFilter = z.infer<typeof temporalFilterSchema>;

// type ResolvedFilterDate = { date: Date; timeOnly: boolean };

// const toValidDate = (value: unknown): ResolvedFilterDate | undefined => {
//   if (value instanceof Date)
//     return isValid(value) ? { date: value, timeOnly: false } : undefined;
//   if (typeof value !== "string" && typeof value !== "number") return undefined;

//   if (
//     typeof value === "string" &&
//     /^\d{1,2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/.test(value)
//   ) {
//     const date = parse(
//       value,
//       value.includes(".")
//         ? "HH:mm:ss.SSS"
//         : value.split(":").length === 3
//           ? "HH:mm:ss"
//           : "HH:mm",
//       new Date(0),
//     );

//     return isValid(date) ? { date, timeOnly: true } : undefined;
//   }

//   const date = typeof value === "string" ? parseISO(value) : new Date(value);
//   return isValid(date) ? { date, timeOnly: false } : undefined;
// };

// const normalizeRange = ([first, second]: FilterDateValue) => {
//   const start = startOfDay(first);
//   const end = endOfDay(second ?? first);
//   return isAfter(start, end) ? [end, start] : [start, end];
// };

// const hasDateValue = (value: FilterTemporalValue) =>
//   Array.isArray(value) &&
//   value.length > 0 &&
//   toValidDate(value[0]) !== undefined;

// const resolveDateValue = (value: unknown) => toValidDate(value);

// const resolveTemporalFilter = (value: unknown) =>
//   temporalFilterSchema.safeParse(value).data;

// const validateDateTimeFilterValue = (value: unknown) =>
//   temporalFilterValueSchema.safeParse(value).success;

const temporalAutoRemoveHandler = (v: unknown) => !(v instanceof Date);

export const filterFn_dateExactly = constructFilterFn({
  filter: (dataValue: Date | undefined, filter: TemporalFilter) => {
    const filterValue = filter.value[0];
    if (!dataValue || !filterValue) return false;
    return isEqual(startOfMinute(dataValue), startOfMinute(filterValue));
  },
  autoRemove: temporalAutoRemoveHandler,
});

export const filterFn_dateIs = constructFilterFn({
  filter: (dataValue: Date | undefined, filter: TemporalFilter) => {
    const filterValue = filter.value[0];
    if (!dataValue || !filterValue) return false;
    return isWithinInterval(dataValue, {
      start: startOfDay(filterValue),
      end: endOfDay(filterValue),
    });
  },
  autoRemove: temporalAutoRemoveHandler,
});

// export const filterFn_dateBefore = constructFilterFn({
//   filter: (
//     dataValue: ResolvedFilterDate | undefined,
//     filterValue: FilterDateValue,
//   ) => {
//     const filterDate = toValidDate(filterValue[0]);
//     if (!dataValue || !filterDate) return false;
//     return dataValue.timeOnly
//       ? isBefore(timeOfDay(dataValue.date), timeOfDay(filterDate.date))
//       : isBefore(dataValue.date, startOfDay(filterDate.date));
//   },
//   autoRemove: (value) => !hasDateValue(value),
//   resolveDataValue: toValidDate,
// });

// export const filterFn_dateAfter = constructFilterFn({
//   filter: (
//     dataValue: ResolvedFilterDate | undefined,
//     filterValue: FilterDateValue,
//   ) => {
//     const filterDate = toValidDate(filterValue[0]);
//     if (!dataValue || !filterDate) return false;
//     return dataValue.timeOnly
//       ? isAfter(timeOfDay(dataValue.date), timeOfDay(filterDate.date))
//       : isAfter(dataValue.date, endOfDay(filterDate.date));
//   },
//   autoRemove: (value) => !hasDateValue(value),
//   resolveDataValue: toValidDate,
// });

// export const filterFn_dateOnOrBefore = constructFilterFn({
//   filter: (
//     dataValue: ResolvedFilterDate | undefined,
//     filterValue: FilterDateValue,
//   ) => {
//     const filterDate = toValidDate(filterValue[0]);
//     if (!dataValue || !filterDate) return false;
//     return dataValue.timeOnly
//       ? !isAfter(timeOfDay(dataValue.date), timeOfDay(filterDate.date))
//       : !isAfter(dataValue.date, endOfDay(filterDate.date));
//   },
//   autoRemove: (value) => !hasDateValue(value),
//   resolveDataValue: toValidDate,
// });

// export const filterFn_dateOnOrAfter = constructFilterFn({
//   filter: (
//     dataValue: ResolvedFilterDate | undefined,
//     filterValue: FilterDateValue,
//   ) => {
//     const filterDate = toValidDate(filterValue[0]);
//     if (!dataValue || !filterDate) return false;
//     return dataValue.timeOnly
//       ? !isBefore(timeOfDay(dataValue.date), timeOfDay(filterDate.date))
//       : !isBefore(dataValue.date, startOfDay(filterDate.date));
//   },
//   autoRemove: (value) => !hasDateValue(value),
//   resolveDataValue: toValidDate,
// });

// export const filterFn_dateBetween = constructFilterFn({
//   filter: (
//     dataValue: ResolvedFilterDate | undefined,
//     filterValue: FilterDateValue,
//   ) => {
//     if (!dataValue || !hasDateValue(filterValue)) return false;
//     if (dataValue.timeOnly) {
//       const first = toValidDate(filterValue[0]);
//       const second = toValidDate(filterValue[1] ?? filterValue[0]);
//       if (!first || !second) return false;
//       const [start, end] = [timeOfDay(first.date), timeOfDay(second.date)].sort(
//         (a, b) => a - b,
//       );
//       const value = timeOfDay(dataValue.date);
//       return isWithinInterval(value, { start, end });
//     }
//     const [start, end] = normalizeRange(filterValue);
//     return isWithinInterval(dataValue.date, { start, end });
//   },
//   autoRemove: (value) => !hasDateValue(value),
//   resolveDataValue: toValidDate,
// });
