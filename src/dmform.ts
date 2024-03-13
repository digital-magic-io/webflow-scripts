import { DmElement, DmField, DmForm } from './dmdom'
import { DmFieldState } from './dmtypes'

export type DmFieldInstance = DmElement<HTMLElement> & {
  label: DmElement<HTMLElement>
  input: DmElement<HTMLInputElement>
  error: DmElement<HTMLElement>
  clearError: () => void
  setError: (error: string) => void
  setState: (state: DmFieldState) => void
  setInputValue: (value: string) => void
}

export type DmFormInstance<T extends string> = DmElement<HTMLElement> & {
  fields: Record<T, DmFieldInstance>
  error: DmElement<HTMLElement>
  clearError: () => void
  clearAllErrors: () => void
  setError: (error: string) => void
  setOnSubmit: (handler: (e: Event) => void) => void
}

const getFormFields = (form: DmForm, fieldNames: ReadonlyArray<string>): ReadonlyArray<DmField> | undefined => {
  const fields = fieldNames.map((name) => form.getField(name))
  if (fields.length !== fieldNames.length) {
    console.error('Form should have all fields!', fieldNames)
    form.setError('Unexpected error: missing fields!')
    return undefined
  } else {
    return fields as ReadonlyArray<DmField>
  }
}

const createRecord = <T>(arr: ReadonlyArray<T>, propertyName: keyof T): Record<string, T> => {
  const record: Record<string, T> = {}

  arr.forEach((item) => {
    const key = item[propertyName] as unknown as string
    record[key] = item
  })

  return record
}

export const createFormInstance = <T extends string>(form: DmForm, fieldNames: ReadonlyArray<T>): DmFormInstance<T> => {
  const fields = getFormFields(form, fieldNames)
  if (!fields) {
    throw new Error('Form should have all fields!')
  }
  const fieldInstances: ReadonlyArray<DmFieldInstance> = fields.map((field) => {
    const label = field.getLabel()
    const input = field.getInput()
    const error = field.getError()
    if (!label || !input || !error) {
      console.error('Form field must have label, input, error elements!', field.name, field.el)
      throw new Error('Form field must have label, input, error elements!')
    }
    return {
      label,
      input,
      error,
      id: field.id,
      name: field.name,
      type: field.type,
      el: field.el,
      show: () => field.show(),
      hide: () => field.hide(),
      clearError: () => field.clearError(),
      setError: (error: string) => field.setError(error),
      setState: (state: DmFieldState) => field.setState(state),
      setInputValue: (value: string) => field.setInputValue(value)
    } satisfies DmFieldInstance
  })

  const error = form.getError()
  if (!error) {
    console.error('Form must have error element!', form.el)
    throw new Error('Form must have error element!')
  }
  return {
    id: form.id,
    name: form.name,
    type: form.type,
    el: form.el,
    show: () => form.show(),
    hide: () => form.hide(),
    fields: createRecord(fieldInstances, 'name'),
    error: error,
    clearError: () => form.clearError(),
    clearAllErrors: () => {
      form.clearError()
      fieldInstances.forEach((field) => field.clearError())
    },
    setError: (error: string) => form.setError(error),
    setOnSubmit: (handler: (e: Event) => void) => form.setOnSubmit(handler)
  } satisfies DmFormInstance<T>
}
