import z from "zod";

export type FormatCsvRangeOptions = {
  sort?: "asc" | "desc";
  distinct?: boolean;
  exclude?: number[];
};

const formatCsvRangeSchema = z.coerce.number().int().positive();

export function getExcelColumnKey(columnNumber: number): string {
  if (columnNumber < 0 || !Number.isInteger(columnNumber)) return "-";

  let result = "";
  let n = columnNumber;

  while (n > 0) {
    n--;
    result = String.fromCharCode((n % 26) + 65) + result;
    n = Math.floor(n / 26);
  }

  return !!result ? result : "-";
}

export function formatCsvRange(input: string, options?: FormatCsvRangeOptions) {
  const excludeSet = new Set(options?.exclude ?? []);

  const result: number[] = [];
  const tokens = input.split(",");

  for (const token of tokens) {
    const trimmed = token.trim();

    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");

      const start = Number(startStr);
      const end = Number(endStr);

      if (
        formatCsvRangeSchema.safeParse(start).success &&
        formatCsvRangeSchema.safeParse(end).success &&
        start <= end
      ) {
        for (let i = start; i <= end; i++)
          if (!excludeSet.has(i)) result.push(i);
      }

      continue;
    }

    const value = Number(trimmed);
    if (formatCsvRangeSchema.safeParse(value).success && !excludeSet.has(value))
      result.push(value);
  }

  const finalResult = options?.distinct ? Array.from(new Set(result)) : result;
  if (options?.sort)
    finalResult.sort((a, b) => (options.sort === "asc" ? a - b : b - a));

  return finalResult;
}
