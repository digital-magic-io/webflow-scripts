import type { DmButton, DmForm, DmLabel } from './form'
import type { FormErrorMessages, Handler } from './types'

export type PageContext<F extends string, B extends string, L extends string> = {
  buttons: Record<B, DmButton>
  labels: Record<L, DmLabel>
  forms: Record<F, DmForm<string>>
  resetAll: Handler<void>
}

export type FormConfigHandlers = {
  beforeSubmit?: Handler<DmForm<string>>
  afterSubmit?: Handler<DmForm<string>>
}

export type ElementConfig = {
  selector: string
}

export type FormConfig<F extends string, B extends string, L extends string> = {
  onSubmit: <T extends Record<string, unknown>>(
    data: T,
    ctx: PageContext<F, B, L>,
    success: Handler<void>,
    fail: Handler<unknown>
  ) => Promise<void>
  onSuccess: (ctx: PageContext<F, B, L>) => void
  onError: <T>(error: T, ctx: PageContext<F, B, L>) => void
  errorMessages?: FormErrorMessages
} & ElementConfig

export type ButtonConfig<F extends string, B extends string, L extends string> = {
  onClick: (ctx: PageContext<F, B, L>) => void
} & ElementConfig

export type LabelConfig = ElementConfig

export type Config<F extends string, B extends string, L extends string> = {
  /*
  dom: {
    idAttr: string
    typeAttr: string
    nameAttr: string
    setFieldState: (selector: string, state: DmFieldState) => void
  }
  */
  forms?: Record<F, FormConfig<F, B, L>>
  buttons?: Record<B, ButtonConfig<F, B, L>>
  labels?: Record<L, LabelConfig>
  errorMessages?: FormErrorMessages
  handlers?: FormConfigHandlers
}
