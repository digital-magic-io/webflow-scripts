import { Config } from './core'
import { ButtonName, CpMessages, FormName, LabelName } from './cp'

export type CpConfig = Readonly<{
  formSelectors: Record<FormName, string>
  buttonSelectors: Record<ButtonName, string>
  labelSelectors: Record<LabelName, string>
  messages: CpMessages
}> &
  Pick<Config<FormName, ButtonName, LabelName>, 'errorMessages' | 'handlers'>
