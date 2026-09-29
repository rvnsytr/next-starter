import { constructFilterFn } from "@tanstack/react-table";
import {
  endOfDay,
  isAfter,
  isBefore,
  isEqual as isDateEqual,
  isWithinInterval,
  startOfDay,
  startOfMinute,
} from "date-fns";
import { z } from "zod";
import { temporalFilterSchema } from "./filter-schema";

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

const temporalFilterAutoRemove = (v: unknown) => !(v instanceof Date);

export const filterFn_dateExactly = constructFilterFn({
  filter: (dataValue: Date | undefined, filter: TemporalFilter) => {
    const filterValue = filter.value[0];
    if (!dataValue || !filterValue) return false;
    return isDateEqual(startOfMinute(dataValue), startOfMinute(filterValue));
  },
  autoRemove: temporalFilterAutoRemove,
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
  autoRemove: temporalFilterAutoRemove,
});

export const filterFn_dateBefore = constructFilterFn({
  filter: (dataValue: Date | undefined, filter: TemporalFilter) => {
    const filterValue = filter.value[0];
    if (!dataValue || !filterValue) return false;
    return isBefore(dataValue, startOfDay(filterValue));
  },
  autoRemove: temporalFilterAutoRemove,
});

export const filterFn_dateOnOrBefore = constructFilterFn({
  filter: (dataValue: Date | undefined, filter: TemporalFilter) => {
    const filterValue = filter.value[0];
    if (!dataValue || !filterValue) return false;
    return isBefore(dataValue, endOfDay(filterValue));
  },
  autoRemove: temporalFilterAutoRemove,
});

export const filterFn_dateAfter = constructFilterFn({
  filter: (dataValue: Date | undefined, filter: TemporalFilter) => {
    const filterValue = filter.value[0];
    if (!dataValue || !filterValue) return false;
    return isAfter(dataValue, endOfDay(filterValue));
  },
  autoRemove: temporalFilterAutoRemove,
});

export const filterFn_dateOnOrAfter = constructFilterFn({
  filter: (dataValue: Date | undefined, filter: TemporalFilter) => {
    const filterValue = filter.value[0];
    if (!dataValue || !filterValue) return false;
    return isAfter(dataValue, startOfDay(filterValue));
  },
  autoRemove: temporalFilterAutoRemove,
});

export const filterFn_dateBetween = constructFilterFn({
  filter: (dataValue: Date | undefined, filter: TemporalFilter) => {
    const filterValueStart = filter.value[0];
    const filterValueEnd = filter.value[1] ?? filterValueStart;

    if (!dataValue || !filterValueStart || !filterValueEnd) return false;

    return isWithinInterval(dataValue, {
      start: startOfDay(filterValueStart),
      end: endOfDay(filterValueEnd),
    });
  },
  autoRemove: temporalFilterAutoRemove,
});
