export type FN<T, R> = (value: T) => R
export type Handler<T> = FN<T, void>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NullableType<T = NonNullable<any>> = T | null | undefined

export type FailedValidationType = 'required' | 'minlength' | 'maxlength' | 'pattern' | 'min' | 'max'

export type Validator = (v: string | number | undefined) => true | FailedValidationType

export type FormErrorMessages = Record<FailedValidationType, string>

export const DmElementTypeList = ['control', 'label', 'error', 'input'] as const
export type DmElementType = (typeof DmElementTypeList)[number]

export const DmFieldStateList = ['error', 'success', 'default'] as const
export type DmFieldState = (typeof DmFieldStateList)[number]
