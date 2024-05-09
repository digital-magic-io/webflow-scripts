import type { FN, ManagedState, NullableType } from './types'

export const isEmpty = <T>(value: NullableType<T>): value is null | undefined => value === null || value === undefined
export const hasValue = <T>(value: NullableType<T>): value is T => !isEmpty(value)
export const mapValue = <T, R>(value: T | undefined, f: FN<T, R>): R | undefined =>
  hasValue(value) ? f(value) : undefined
export const getOrElse = <T>(value: NullableType<T>, defaultValue: T): T => (hasValue(value) ? value : defaultValue)
export const mapOrElse = <T, R>(value: NullableType<T>, f: FN<T, R>, defaultValue: R): R =>
  hasValue(value) ? f(value) : defaultValue

export const createState = <T>(initialState: T): ManagedState<T> => {
  let state = initialState
  return {
    set: (newState: T) => {
      state = newState
    },
    get: () => state
  }
}
