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
import { createState } from './core/utils'

const setVisibilityForAll = (selector: string | undefined, value: boolean): void => {
  if (selector) {
    const elements = document.querySelectorAll<HTMLElement>(selector)
    elements.forEach((el) => {
      setElementVisible(el, value)
    })
  }
}

/*
const setVisibility = (selector: string | undefined, value: boolean): void => {
  if (selector) {
    const el = document.querySelector<HTMLElement>(selector)
    if (el) {
      setElementVisible(el, value)
    }
  }
}
*/

const setElementVisible = (el: HTMLElement, value: boolean): void => {
  el.style.display = value ? 'flex' : 'none'
}

export const initCp = (conf: CpConfig): void => {
  console.log('Initializing...', conf)

  const state: ActionState = {
    formId: createState<string | undefined>(undefined),
    messages: conf.messages,
    captchaKey: conf.captchaKey
  }

  const labelConfig: AppConfig['labels'] = {
    markAndModel: {
      selector: conf.labelSelectors.markAndModel
    },
    plateNumber: {
      selector: conf.labelSelectors.plateNumber
    }
  }
  /*
  // TODO: Correct approach is to map over config entries
  Object.entries<string>(conf.labelSelectors)
  .map(([labelName, selector]) => ({
    [labelName]: {
      selector: selector
    }
  }))
  .reduce((acc, val) => ({ ...acc, ...val }), {})
   */

  const buttonConfig: AppConfig['buttons'] = {
    /*
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
    */
  }

  const initialFormConfig: CpFormConfig<InitialForm> = {
    selector: '[data-dm-id="form_find_vehicle"]',
    onSuccess: (ctx) => {
      conf.actions.switchStep(1, ctx)
    },
    onError: (error, ctx) => {
      ctx.forms.initial.setError(error)
    },
    onSubmit: (data, ctx, success, fail) => submitInitialForm({ data, ctx, success, fail, state })
  }

  const vehicleErrorMessages: Partial<FormErrorMessages> = {
    pattern: state.messages.invalidEmailError
  }

  const vehicleFormConfig: CpFormConfig<VehicleForm> = {
    selector: '[data-dm-id="form_vehicle"]',
    errorMessages: vehicleErrorMessages,
    onSuccess: (ctx) => {
      conf.actions.switchStep(2, ctx)
    },
    onError: (error, ctx) => {
      ctx.forms.vehicle.setError(error)
    },
    onSubmit: (data, ctx, success, fail) => submitVehicleForm({ data, ctx, success, fail, state })
  }

  const filesFormConfig: CpFormConfig<FileForm> = {
    selector: '[data-dm-id="form_files"]',
    onSuccess: (ctx) => {
      conf.actions.switchStep(3, ctx)
    },
    onError: (error, ctx) => {
      ctx.forms.files.setError(error)
    },
    onSubmit: (data, ctx, success, fail) => submitFiles({ data, ctx, success, fail, state })
  }

  const cfg: AppConfig = {
    forms: {
      initial: initialFormConfig,
      vehicle: vehicleFormConfig,
      files: filesFormConfig
    },
    buttons: buttonConfig,
    labels: labelConfig,
    handlers: {
      beforeSubmit: (form) => {
        form.setFormDisabled(true)
        setVisibilityForAll(conf.loaderSelector, true)
      },
      afterSubmit: (form) => {
        form.setFormDisabled(false)
        setVisibilityForAll(conf.loaderSelector, false)
      }
    },
    errorMessages: conf.errorMessages,
    afterInit: (ctx) => {
      console.log('After init:', ctx)
      setVisibilityForAll(conf.loaderSelector, false)
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
