import { Validator } from './dmtypes'
import { DmFieldInstance } from './dmform'

export const isEmpty = <T>(value: T | undefined | null): value is undefined | null =>
  value === null || value === undefined

export const validateInput = (
  field: DmFieldInstance,
  validator: Validator,
  errMsg: () => string
): string | undefined => {
  const value = field.input.el.value
  if (!value) {
    console.error('Form field has no input!', field.name, field.el)
    return undefined
  }
  if (!validator(value)) {
    field.setError(errMsg())
    return undefined
  }
  return value
}

export const validateNonEmpty = (field: DmFieldInstance): string | undefined =>
  validateInput(
    field,
    (value) => value.length > 0,
    () => 'This field must be filled!'
  )

export const validateEmail = (field: DmFieldInstance): string | undefined =>
  validateInput(
    field,
    (value) => value.includes('@'),
    () => 'Invalid email!'
  )
