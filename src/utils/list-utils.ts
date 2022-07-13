export type ArrayWithoutNulls<T extends any[]> = Exclude<T[0], null | undefined>[];

export function filterTruthy<T>(arr?: T[] | null) {
  if (!arr) return undefined;
  return arr.filter(a => !!a) as unknown as ArrayWithoutNulls<T[]>;
}