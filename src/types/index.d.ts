/* eslint-disable @typescript-eslint/ban-types */

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

export type FilteredKeys<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T]

export type PropertyOf<T> = Pick<T, Exclude<keyof T, FilteredKeys<T, Function>>>
