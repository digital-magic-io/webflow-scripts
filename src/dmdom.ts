import { DmElementType, DmFieldState, DmFieldStateList } from './dmtypes'

export type DmElement<T extends HTMLElement> = {
  id?: string
  name?: string
  type?: DmElementType
  el: T
  show: () => void
  hide: () => void
}

export type DmField = DmElement<HTMLElement> & {
  getLabel: () => DmElement<HTMLElement> | undefined
  getInput: () => DmElement<HTMLInputElement> | undefined
  setInputValue: (value: string) => void
  getError: () => DmElement<HTMLElement> | undefined
  clearError(): void
  setError: (error: string) => void
  setState: (state: DmFieldState) => void
}

export type DmForm = DmElement<HTMLFormElement> & {
  getField: (name: string) => DmField | undefined
  getError: () => DmElement<HTMLElement> | undefined
  clearError(): void
  setError: (error: string) => void
  setOnSubmit: (handler: (e: Event) => void) => void
}

const getElement = <T extends HTMLElement>(path: string): T | undefined => {
  const el: HTMLElement | null = document.querySelector(path)
  if (el === null) {
    console.error(`Element not found by path: ${path}.`)
    return undefined
  } else {
    return el as T
  }
}

const createDmElement = <T extends HTMLElement>(el: T, name: string | undefined = undefined): DmElement<T> => {
  return {
    el,
    id: el.attributes.getNamedItem('data-dm-id')?.value,
    name: name ?? el.attributes.getNamedItem('data-dm-name')?.value,
    type: el.attributes.getNamedItem('data-dm-type')?.value as DmElementType,
    show: () => {
      el.style.display = 'block'
    },
    hide: () => {
      el.style.display = 'none'
    }
  }
}

const createDmElementOpt = <T extends HTMLElement>(
  el: T | undefined,
  name: string | undefined = undefined
): DmElement<T> | undefined => (el ? createDmElement(el, name) : undefined)

export const getElementById = <T extends HTMLElement>(id: string): T | undefined =>
  getElement<T>(`[data-dm-id="${id}"]`)

const getElementChildByType = <T extends HTMLElement>(name: string, type: DmElementType): T | undefined =>
  getElement<T>(`[data-dm-name="${name}"] [data-dm-type="${type}"]`)

const getElementChildByName = <T extends HTMLElement>(id: string, name: string): T | undefined =>
  getElement<T>(`[data-dm-id="${id}"] [data-dm-name="${name}"]`)

const getField = (name: string): DmField | undefined => {
  const field = getElement<HTMLInputElement>(`[data-dm-name="${name}"]`)
  const getErrorEl = (): HTMLElement | undefined => getElementChildByType<HTMLElement>(name, 'error')
  const setState = (state: DmFieldState): void => {
    const el = getErrorEl()
    if (el) {
      DmFieldStateList.map((s) => `field-state-${s}`)
        .filter((v) => el.classList.contains(v))
        .forEach((s) => el.classList.remove(s))
      el.classList.add(`field-state-${state}`)
    }
  }
  if (field) {
    return {
      ...createDmElement(field, name),
      getLabel: () => createDmElementOpt(getElementChildByType<HTMLElement>(name, 'label')),
      getInput: () => createDmElementOpt<HTMLInputElement>(getElementChildByType<HTMLInputElement>(name, 'input')),
      setInputValue: (value: string) => {
        getElementChildByType<HTMLInputElement>(name, 'input')?.setAttribute('value', value)
      },
      getError: () => createDmElementOpt(getErrorEl()),
      setState: setState,
      clearError() {
        const el = getErrorEl()
        if (el) {
          setState('default')
          el.innerHTML = ''
        }
      },
      setError: (error: string): void => {
        const el = getErrorEl()
        if (el) {
          setState('error')
          el.innerHTML = error
        }
      }
    } as DmField
  } else {
    return undefined
  }
}

export const setupFormHandler = (form: HTMLFormElement, handler: (e: Event) => void): void => {
  form.action = ''
  form.method = ''
  form.onsubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  // TODO: Remove all event listeners
  form.addEventListener('submit', handler)
}

export const getForm = (name: string): DmForm | undefined => {
  const form = getElement<HTMLFormElement>(`[data-dm-id="${name}"]`)
  const getErrorEl = (): HTMLElement | undefined => getElementChildByName<HTMLElement>(name, 'form_error')
  if (form) {
    return {
      name: name,
      el: form,
      show: () => {
        form.style.display = 'block'
      },
      hide: () => {
        form.style.display = 'none'
      },
      getField: getField,
      getError: () => createDmElementOpt(getErrorEl()),
      clearError() {
        const el = getErrorEl()
        if (el) {
          el.innerHTML = ''
        }
      },
      setError: (error: string) => {
        const el = getErrorEl()
        if (el) {
          el.innerHTML = error
        }
      },
      setOnSubmit: (handler) => setupFormHandler(form, handler)
    }
  } else {
    return undefined
  }
}
