import type { DmButton, DmForm, DmLabel } from './form'
import type { FormErrorMessages, Handler } from './types'

export type PageContext<F extends string, B extends string, L extends string> = {
  buttons: Record<B, DmButton>
  labels: Record<L, DmLabel>
  forms: Record<F, DmForm<string>>
  resetAll: Handler<void>
  debug: boolean
}

export type FormHandlers = {
  init?: Handler<DmForm<string>>
  beforeSubmit?: Handler<DmForm<string>>
  afterSubmit?: Handler<DmForm<string>>
}

export type ElementConfig = {
  selector: string
}

export type FormConfig<F extends string, B extends string, L extends string, V extends Record<string, unknown>> = {
  onSubmit: (data: V, ctx: PageContext<F, B, L>, success: Handler<void>, fail: Handler<string>) => Promise<void>
  onSuccess: (ctx: PageContext<F, B, L>) => void
  onError: (error: string, ctx: PageContext<F, B, L>) => void
  errorMessages?: Partial<FormErrorMessages>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  forms?: Record<F, FormConfig<F, B, L, any>>
  buttons?: Record<B, ButtonConfig<F, B, L>>
  labels?: Record<L, LabelConfig>
  errorMessages?: FormErrorMessages
  handlers?: FormHandlers
  afterInit?: Handler<PageContext<F, B, L>>
  debug?: boolean
}
