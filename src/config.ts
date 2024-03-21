import type { DmForm } from './form'
import type { FormErrorMessages } from './types'

export type PageContext<T extends string> = {
  forms: Record<T, DmForm<string>>
}

export type FormConfig<T extends string> = {
  selector: string
  onSubmit: (data: Record<string, unknown>, ctx: PageContext<T>) => void
  errorMessages?: FormErrorMessages
}

export type ButtonConfig<T extends string> = {
  selector: string
  onClick: (ctx: PageContext<T>) => void
}

export type Config<F extends string, B extends string> = {
  /*
  dom: {
    idAttr: string
    typeAttr: string
    nameAttr: string
    setFieldState: (selector: string, state: DmFieldState) => void
  }
  */
  forms?: Record<F, FormConfig<F>>
  buttons?: Record<B, ButtonConfig<B>>
  errorMessages?: FormErrorMessages
}
