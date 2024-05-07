import { CpConfig } from './config'
import {
  ButtonName,
  CpPageContext,
  FileForm,
  FormName,
  InitialForm,
  LabelName,
  submitFiles,
  submitInitialForm,
  submitVehicleForm,
  VehicleForm
} from './cp'
import { Config, FormConfig, init, LabelConfig } from './core'
import { FormErrorMessages } from './core/types'

type Cfg = Config<FormName, ButtonName, LabelName>
type FormCfg = FormConfig<FormName, ButtonName, LabelName>

export const initCp = (conf: CpConfig): void => {
  console.log('Initializing...', conf)

  // eslint-disable-next-line prefer-const
  let formId: string | undefined = undefined
  const setFormId = (id: string): void => {
    formId = id
  }

  const labelConfig: Cfg['labels'] = {
    testLabel: {
      selector: '[data-dm-id="testLabel"]'
    }
  }

  const buttonConfig: Cfg['buttons'] = {
    manual: {
      selector: '[data-dm-id="manual"]',
      onClick: (ctx) => {
        console.debug('Button clicked:', ctx)
        ctx.buttons.manual.setDisabled(true)
        ctx.buttons.manual.setLabel('Loading...')
        ctx.labels.testLabel.setLabel('Test label')
        setTimeout(() => {
          ctx.forms.initial.el.style.display = 'none'
          ctx.forms.vehicle.el.removeAttribute('style')
        }, 3000)
      }
    }
  }

  const initialFormConfig: FormCfg = {
    selector: '[data-dm-id="form_find_vehicle"]',
    onSuccess: (ctx) => {
      console.log('Next step')
      ctx.forms.initial.el.style.display = 'none'
      ctx.forms.vehicle.el.removeAttribute('style')
    },
    onError: (error: string, ctx) => {
      ctx.forms.initial.setError(error)
    },
    onSubmit: (data: InitialForm, ctx, success, fail) =>
      submitInitialForm({ data, ctx, success, fail, setFormId, formId })
  }

  // TODO: Translate error messages!
  const vehicleErrorMessages: FormErrorMessages = {
    pattern: 'Email is not valid'
  }

  const vehicleFormConfig: FormCfg = {
    selector: '[data-dm-id="form_vehicle"]',
    errorMessages: vehicleErrorMessages,
    onSuccess: (ctx) => {
      console.log('Next step')
      ctx.forms.vehicle.el.style.display = 'none'
      ctx.forms.files.el.removeAttribute('style')
    },
    onError: (error: string, ctx) => {
      ctx.forms.vehicle.setError(error)
    },
    onSubmit: (data: VehicleForm, ctx, success, fail) =>
      submitVehicleForm({ data, ctx, success, fail, setFormId, formId })
  }

  const filesFormConfig: FormCfg = {
    selector: '[data-dm-id="form_files"]',
    onSuccess: (ctx) => {
      ctx.forms.files.el.style.display = 'none'
      document.getElementById('success_step')?.removeAttribute('style')
      console.log('Great Success!')
    },
    onError: (error: string, ctx) => {
      ctx.forms.files.setError(error)
    },
    onSubmit: (data: FileForm, ctx, success, fail) => submitFiles({ data, ctx, success, fail, setFormId, formId })
  }

  const cfg: Cfg = {
    forms: {
      initial: initialFormConfig,
      vehicle: vehicleFormConfig,
      files: filesFormConfig
    },
    buttons: buttonConfig,
    labels: labelConfig,
    handlers: conf.handlers,
    errorMessages: conf.errorMessages
  }
  init(cfg)
}
