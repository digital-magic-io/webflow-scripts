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
import { DmForm } from './core/form'

const setVisibilityForAll = (selector: string | undefined, value: boolean): void => {
  if (selector) {
    const elements = document.querySelectorAll<HTMLElement>(selector)
    elements.forEach((el) => {
      setElementVisible(el, value)
    })
  }
}

const setElementVisible = (el: HTMLElement, value: boolean): void => {
  el.style.display = value ? 'flex' : 'none'
}

export const initCp = (conf: CpConfig): void => {
  const state: ActionState = {
    formId: createState<string | undefined>(undefined),
    messages: conf.messages,
    captchaKey: conf.captchaKey,
    limits: {
      maxFilesCount: conf.limits?.maxFilesCount ?? 10,
      maxFileSizeMb: conf.limits?.maxFileSizeMb ?? 10
    }
  }

  const beforeSubmit = (form: DmForm<string>): void => {
    form.setFormDisabled(true)
    setVisibilityForAll(conf.loaderSelector, true)
  }
  const afterSubmit = (form: DmForm<string>): void => {
    form.setFormDisabled(false)
    setVisibilityForAll(conf.loaderSelector, false)
  }

  const withSubmitAction = async (form: DmForm<string>, action: () => Promise<void>): Promise<void> => {
    beforeSubmit(form)
    await action().finally(() => afterSubmit(form))
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
    updateVehicle: {
      selector: conf.buttonSelectors.updateVehicle,
      onClick: (ctx) => {
        void withSubmitAction(ctx.forms.vehicle, async () => {
          const plateNumber = ctx.forms.vehicle.fields.plateNumber.input.el.value
          await reloadVehicleFormData({
            data: { plateNumber },
            ctx,
            success: () => {},
            fail: (error) => ctx.forms.vehicle.setError(error),
            state
          })
        })
      }
    }
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
    handlers: { beforeSubmit, afterSubmit },
    errorMessages: conf.errorMessages,
    afterInit: () => {
      setVisibilityForAll(conf.loaderSelector, false)
    }
  }
  init(cfg)
}
