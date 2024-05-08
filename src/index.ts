import { CpConfig } from './config'
import {
  ActionState,
  AppConfig,
  CpFormConfig,
  FileForm,
  InitialForm,
  reloadVehicleFormData,
  submitFiles,
  submitInitialForm,
  submitVehicleForm,
  VehicleForm
} from './cp'
import { init } from './core'
import { FormErrorMessages } from './core/types'

export const initCp = (conf: CpConfig): void => {
  console.log('Initializing...', conf)

  // eslint-disable-next-line prefer-const
  let formId: string | undefined = undefined
  const setFormId = (id: string): void => {
    formId = id
  }
  const getFormId = (): string | undefined => {
    return formId
  }

  const state: ActionState = {
    getFormId,
    setFormId,
    messages: conf.messages
  }

  const labelConfig: AppConfig['labels'] = {
    testLabel: {
      selector: '[data-dm-id="testLabel"]'
    }
  }

  const buttonConfig: AppConfig['buttons'] = {
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

  const initialFormConfig: CpFormConfig = {
    selector: '[data-dm-id="form_find_vehicle"]',
    onSuccess: (ctx) => {
      conf.actions.switchStep(1, ctx)
    },
    onError: (error: string, ctx) => {
      ctx.forms.initial.setError(error)
    },
    onSubmit: (data: InitialForm, ctx, success, fail) => submitInitialForm({ data, ctx, success, fail, state })
  }

  const vehicleErrorMessages: Partial<FormErrorMessages> = {
    pattern: state.messages.invalidEmailError
  }

  const vehicleFormConfig: CpFormConfig = {
    selector: '[data-dm-id="form_vehicle"]',
    errorMessages: vehicleErrorMessages,
    onSuccess: (ctx) => {
      conf.actions.switchStep(2, ctx)
    },
    onError: (error: string, ctx) => {
      ctx.forms.vehicle.setError(error)
    },
    onSubmit: (data: VehicleForm, ctx, success, fail) => submitVehicleForm({ data, ctx, success, fail, state })
  }

  const filesFormConfig: CpFormConfig = {
    selector: '[data-dm-id="form_files"]',
    onSuccess: (ctx) => {
      conf.actions.switchStep(3, ctx)
    },
    onError: (error: string, ctx) => {
      ctx.forms.files.setError(error)
    },
    onSubmit: (data: FileForm, ctx, success, fail) => submitFiles({ data, ctx, success, fail, state })
  }

  const cfg: AppConfig = {
    forms: {
      initial: initialFormConfig,
      vehicle: vehicleFormConfig,
      files: filesFormConfig
    },
    buttons: buttonConfig,
    labels: labelConfig,
    handlers: conf.handlers,
    errorMessages: conf.errorMessages,
    afterInit: (ctx) => {
      console.log('After init:', ctx)
      ctx.forms.vehicle.fields.plateNumber.input.el.onblur = () => {
        const plateNumber = ctx.forms.vehicle.fields.plateNumber.input.el.value
        console.log('On blur:', ctx.forms.vehicle.fields.plateNumber.input.el.value)
        const formCfg = vehicleFormConfig
        void reloadVehicleFormData({
          data: { plateNumber },
          ctx,
          success: () => {},
          fail: (error) => formCfg.onError(error, ctx),
          state
        })
      }
    }
  }
  init(cfg)
}
