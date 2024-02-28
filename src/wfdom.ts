export const getElement = <T extends HTMLElement>(path: string): T | undefined => {
  const el: HTMLElement | null = document.querySelector(path)
  if (el === null) {
    console.error(`Element not found by path: ${path}.`)
    return undefined
  } else {
    return el as T
  }
}
export const getInput = (path: string): HTMLInputElement | undefined => getElement<HTMLInputElement>(path)
export const setInput = (path: string, value: string): void => {
  const input = getInput(path)
  if (input) {
    input.value = value
  }
}

export const getForm = (path: string): HTMLFormElement | undefined => getElement<HTMLFormElement>(path)

export const setMsg = (path: string, msg: string): void => {
  const el = getElement(path)
  if (el) {
    el.innerHTML = msg
  }
}

export const setupFormHandler = (path: string, handler: (e: Event) => void): void => {
  const form = getForm(path)
  if (form) {
    form.action = ''
    form.method = ''
    form.onsubmit = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }
    // TODO: Remove all event listeners
    form.addEventListener('submit', handler)
  } else {
    console.error(`Unable to find form with id "${path}"`)
  }
}

export const setupBtnHandler = (path: string, handler: (e: Event) => void): void => {
  const btn = getElement<HTMLButtonElement>(path)
  if (btn) {
    btn.onclick = handler
  } else {
    console.error(`Unable to find button with id "${path}"`)
  }
}
