import { Config } from './core'
import { ButtonName, FormName, LabelName } from './cp'

export type CpConfig = Readonly<{
  formSelectors: Record<FormName, string>
  buttonSelectors: Record<ButtonName, string>
  labelSelectors: Record<LabelName, string>
}> &
  Pick<Config<FormName, ButtonName, LabelName>, 'errorMessages' | 'handlers'>
