import type { FN, FormErrorMessages, Handler, Validator } from './types'
import { getElement, getFormElement, getInputElement, setupFormHandler } from './dom'

class FormError extends Error {
  parent?: HTMLElement

  constructor(message: string, parent?: HTMLElement) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.parent = parent
  }

  public toString(): string {
    return this.message + ' Parent: [' + JSON.stringify(parent) + ']'
  }
}

type DmElement<T extends HTMLElement> = {
  el: T
}

export type DmField = DmElement<HTMLElement> & {
  input: DmElement<HTMLInputElement>
  error: DmElement<HTMLElement>
  validator: Validator
  clearError: Handler<void>
  setError: Handler<string>
  // TODO: Value may be string | number
  setInputValue: Handler<string>
}

export type DmForm<T extends string> = DmElement<HTMLElement> & {
  fields: Record<T, DmField>
  error: DmElement<HTMLElement>
  clearError: Handler<void>
  clearAllErrors: Handler<void>
  setError: Handler<string>
  // TODO: Value may be string | number
  getFormValues: FN<void, Record<T, string>>
  setFormValues: Handler<Record<T, string>>
  resetForm: Handler<void>
  setFormDisabled: Handler<boolean>
  setOnSubmit: FN<FN<Event, Promise<void>>, void>
}

const scanFormFieldNames = (formElement: HTMLFormElement): ReadonlyArray<string> => {
  // TODO: Field selector must be configurable
  const formFieldElements = formElement.querySelectorAll('[data-dm-type="control"]')
  return Array.from(formFieldElements.values())
    .map((el) => el.getAttribute('data-dm-name'))
    .filter((name): name is string => !!name)
}

const createFormError = (formElement: HTMLFormElement): HTMLElement => {
  // TODO: Error selector must be configurable
  const element = getElement('[data-dm-name="form_error"]', formElement)
  if (!element) {
    throw new FormError('Form error element not found for form', formElement)
  }
  return element
}

const createFieldInput = (fieldElement: HTMLElement): HTMLInputElement => {
  // TODO: Field input selector must be configurable
  const element = getInputElement('[data-dm-type="input"]', fieldElement)
  if (!element) {
    throw new FormError('Form input element not found for: ', fieldElement)
  }
  return element
}

const createFieldError = (fieldElement: HTMLElement): HTMLElement => {
  // TODO: Field error selector must be configurable
  const element = getElement('[data-dm-type="error"]', fieldElement)
  if (!element) {
    throw new FormError('Form error element not found for: ', fieldElement)
  }
  return element
}

const createFieldValidation = (inputElement: HTMLInputElement): Validator => {
  const required = inputElement.hasAttribute('required')
  const minLength = inputElement.getAttribute('minlength')
  const maxLength = inputElement.getAttribute('maxlength')
  const pattern = inputElement.getAttribute('pattern')
  const min = inputElement.getAttribute('min')
  const max = inputElement.getAttribute('max')

  return (value) => {
    if (required && !value) {
      return 'required'
    }
    if (minLength && String(value).length < Number(minLength)) {
      return 'minlength'
    }
    if (maxLength && String(value).length > Number(maxLength)) {
      return 'maxlength'
    }
    if (pattern && !new RegExp(pattern).test(String(value))) {
      return 'pattern'
    }
    if (min && Number(value) < Number(min)) {
      return 'min'
    }
    if (max && Number(value) > Number(max)) {
      return 'max'
    }
    return true
  }
}

const createFormField = (formElement: HTMLFormElement, name: string): DmField => {
  // TODO: Field selector must be configurable
  const fieldElement = getElement(`[data-dm-name="${name}"]`, formElement)
  if (!fieldElement) {
    throw new FormError('Form field element not found by name: "' + name, formElement)
  }
  const inputElement = createFieldInput(fieldElement)
  const errorElement = createFieldError(fieldElement)
  const validator: Validator = createFieldValidation(inputElement)

  return {
    el: fieldElement,
    input: { el: inputElement },
    error: { el: errorElement },
    validator: validator,
    clearError: () => (errorElement.textContent = ''),
    setError: (error: string) => (errorElement.textContent = error),
    setInputValue: (value: string) => (inputElement.value = value)
  } satisfies DmField
}

export const createForm = <T extends string>(
  selector: string,
  formName: T,
  formErrorMessages: FormErrorMessages
): DmForm<T> => {
  console.debug('Creating form:', formName, selector)
  const formElement = getFormElement(selector)
  if (!formElement) {
    throw new Error('Form element not found by selector: ' + selector)
  }

  // TODO: Must be optional!
  const formErrorElement = createFormError(formElement)

  const fieldNames = scanFormFieldNames(formElement)
  console.debug('Fields scanned:', fieldNames)

  const fieldElements: Record<string, DmField> = fieldNames
    .map((name) => createFormField(formElement, name))
    .reduce((acc, cur) => ({ ...acc, [cur.input.el.name]: cur }), {})

  const getFormValues = (): Record<T, string> =>
    Object.entries<DmField>(fieldElements)
      .filter(([, instance]) => !!instance && instance.input.el.value.trim().length > 0)
      .map(([name, instance]) => ({ [name]: instance.input.el.value }))
      .reduce((acc, cur) => ({ ...acc, ...cur }), {}) as Record<T, string>

  const setFormValues = (values: Record<T, string>): void => {
    Object.entries<string>(values).forEach(([name, value]) => {
      if (fieldElements[name]) {
        fieldElements[name].setInputValue(value)
      }
    })
  }

  const resetForm = (): void => {
    Object.values(fieldElements).forEach((field) => field.setInputValue(''))
  }

  const setFormDisabled = (disabled: boolean): void => {
    Object.values(fieldElements).forEach((field) => (field.input.el.disabled = disabled))
    Array.from(formElement.getElementsByTagName('button')).forEach((button) => {
      button.disabled = disabled
    })
  }

  const setOnSubmit = (handler: (e: Event) => void): void =>
    setupFormHandler(formElement, (e) => {
      const errors = Object.entries(fieldElements)
        .map(([name, field]) => ({ [name]: field.validator(field.input.el.value) }))
        .reduce((acc, cur) => ({ ...acc, ...cur }), {})
      const hasErrors = Object.values(errors).some((error) => error !== true)
      if (hasErrors) {
        console.error('Validation errors', errors)
        Object.entries(errors).forEach(([name, error]) => {
          if (error !== true) {
            fieldElements[name].setError(formErrorMessages[error])
          }
        })
        //formErrorElement.textContent = 'Form has errors!'
      } else {
        handler(e)
      }
    })

  return {
    el: formElement,
    fields: fieldElements,
    error: { el: formErrorElement },
    clearError: () => (formErrorElement.textContent = ''),
    clearAllErrors: () => {
      formErrorElement.textContent = ''
      Object.values(fieldElements).forEach((field) => field.clearError())
    },
    setError: (error: string) => (formErrorElement.textContent = error),
    getFormValues,
    setFormValues,
    resetForm,
    setFormDisabled,
    setOnSubmit
  }
}
