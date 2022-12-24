/* eslint-disable @typescript-eslint/ban-types */
import { Order } from '@/constants'
import { Document } from 'mongoose'

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

export type PaginationParams<M extends Base = any> = {
  page: number
  limit: number
  order?: Order
  sort?: keyof M | string
} & {
  [K in string]: any
}

export type PaginationDistinctParams<M extends Base = any> = PaginationParams<M> & {
  distinct: SortingKeys<M>
}

export type PaginatedResult<T = any> = {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  items: T[]
}

export type SortingKeys<M = any, D = M> = keyof ({
  [K in keyof M]: M[K]
} & {
  [K in keyof D & string as `-${K}`]: D[K]
})

type ExtractModel<T> = Omit<T, keyof Omit<Document, '_id' | 'createdAt' | 'updatedAt'>> & {
  id?: number
}

export type FilteredKeys<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T]

export type PropertyOf<T> = Pick<T, Exclude<keyof T, FilteredKeys<T, Function>>>
