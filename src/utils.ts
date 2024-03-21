import type { NullableType } from './types'

export const isEmpty = <T>(value: NullableType<T>): value is null | undefined => value === null || value === undefined
export const hasValue = <T>(value: NullableType<T>): value is T => !isEmpty(value)
