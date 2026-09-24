import { isEqual as isEqualDate } from "date-fns";

export function isEqual(left: unknown, right: unknown): boolean {
  const visited = new WeakMap<object, WeakSet<object>>();

  function compare(first: unknown, second: unknown): boolean {
    if (Object.is(first, second)) return true;

    if (
      first === null ||
      second === null ||
      typeof first !== "object" ||
      typeof second !== "object"
    )
      return false;

    if (first instanceof Date || second instanceof Date)
      return (
        first instanceof Date &&
        second instanceof Date &&
        isEqualDate(first, second)
      );

    const seen = visited.get(first);
    if (seen?.has(second)) return true;
    if (seen) seen.add(second);
    else visited.set(first, new WeakSet([second]));

    if (Array.isArray(first) || Array.isArray(second)) {
      if (!Array.isArray(first) || !Array.isArray(second)) return false;
      if (first.length !== second.length) return false;
      return first.every((value, index) => compare(value, second[index]));
    }

    if (Object.getPrototypeOf(first) !== Object.getPrototypeOf(second))
      return false;

    const firstKeys = Object.keys(first);
    const secondKeys = Object.keys(second);
    if (firstKeys.length !== secondKeys.length) return false;

    return firstKeys.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(second, key) &&
        compare(
          first[key as keyof typeof first],
          second[key as keyof typeof second],
        ),
    );
  }

  return compare(left, right);
}
