export const getElement = <T extends HTMLElement = HTMLElement>(
  selector: string,
  parent?: HTMLElement
): T | undefined => {
  const el: HTMLElement | null = (parent ?? document).querySelector(selector)
  if (el === null) {
    console.error(`Element not found by selector: ${parent ? 'parent' : 'document'}.${selector}.`)
    return undefined
  } else {
    return el as T
  }
}

export const getFormElement = (selector: string): HTMLFormElement | undefined => getElement<HTMLFormElement>(selector)

export const getInputElement = (selector: string, parent?: HTMLElement): HTMLInputElement | undefined =>
  getElement<HTMLInputElement>(selector, parent)

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
