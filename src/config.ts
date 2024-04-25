import type { DmForm } from './form'
import type { FormErrorMessages, Handler } from './types'

export type PageContext<T extends string> = {
  forms: Record<T, DmForm<string>>
  resetAll: Handler<void>
}

export type FormConfigHandlers = {
  beforeSubmit?: Handler<DmForm<string>>
  afterSubmit?: Handler<DmForm<string>>
}

export type FormConfig<T extends string> = {
  selector: string
  onSubmit: (
    data: Record<string, unknown>,
    ctx: PageContext<T>,
    success: Handler<void>,
    fail: Handler<unknown>
  ) => Promise<void>
  onSuccess: (ctx: PageContext<T>) => void
  onError: (error: unknown, ctx: PageContext<T>) => void
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
  buttons?: Record<B, ButtonConfig<F>>
  errorMessages?: FormErrorMessages
  handlers?: FormConfigHandlers
}