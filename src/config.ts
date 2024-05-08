import { Config } from './core'
import { ButtonName, CpMessages, CpPageContext, FormName, LabelName } from './cp'

export type CpActions = Readonly<{
  switchStep: (step: number, ctx: CpPageContext) => void
}>

export type CpConfig = Readonly<{
  formSelectors: Record<FormName, string>
  buttonSelectors: Record<ButtonName, string>
  labelSelectors: Record<LabelName, string>
  messages: CpMessages
  actions: CpActions
  captchaKey?: string
}> &
  Pick<Config<FormName, ButtonName, LabelName>, 'errorMessages' | 'handlers'>
