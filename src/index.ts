import type { ButtonConfig, Config, FormConfig, FormConfigHandlers, PageContext } from './config'
import type { FailedValidationType, FormErrorMessages } from './types'
import type { DmForm } from './form'
import { createForm } from './form'

export {
  getTyped as apiGet,
  postTyped as apiPost,
  uploadTypedFileList as apiUploadFileList,
  getErrorFromResponse as apiGetErrorFromResponse,
  ApiError
} from './fetch'

const setupForm = <T extends string>(
  ctx: PageContext<T>,
  formName: T,
  formConfig: FormConfig<T>,
  globalErrorMessages: FormErrorMessages,
  handlers?: FormConfigHandlers
): DmForm<T> => {
  console.debug('Form:', formName, formConfig)
  const form = createForm(formConfig.selector, formName, { ...globalErrorMessages, ...formConfig.errorMessages })
  form.setOnSubmit(async () => {
    console.log('Form submitted:', formName, form.fields)
    handlers?.beforeSubmit?.(form)
    await formConfig.onSubmit(
      form.getFormValues(),
      ctx,
      () => formConfig.onSuccess(ctx),
      (error) => formConfig.onError(error, ctx)
    )
    handlers?.afterSubmit?.(form)
  })
  form.el.setAttribute('novalidate', 'true')
  return form
}

const defaultErrors: Record<FailedValidationType, string> = {
  required: 'This field is required',
  minlength: 'Field length is too small',
  maxlength: 'Field length is too big',
  pattern: 'Field does not match the pattern',
  min: 'Field value is too small',
  max: 'Field value is too big'
}

export const init = <F extends string, B extends string>(conf: Config<F, B>): void => {
  console.log('Initializing...', conf)

  const ctx: PageContext<F> = {
    forms: {}
  } as PageContext<F>

  if (conf.forms) {
    // TODO: Update foreach to map or reduce
    Object.entries<FormConfig<F>>(conf.forms).forEach(([formName, formConfig]) => {
      ctx.forms[formName as F] = setupForm<F>(
        ctx,
        formName as F,
        formConfig,
        conf.errorMessages ?? defaultErrors,
        conf.handlers
      ) satisfies DmForm<F>
    })
    ctx.resetAll = () => {
      Object.values<DmForm<string>>(ctx.forms).forEach((form) => form.resetForm())
    }
    if (conf.buttons) {
      Object.entries<ButtonConfig<F>>(conf.buttons).forEach(([, buttonConfig]) => {
        const button: HTMLElement | null = document.querySelector(buttonConfig.selector)
        if (button) {
          button.addEventListener('click', () => buttonConfig.onClick(ctx))
        } else {
          console.error('Button not found by selector:', buttonConfig.selector)
        }
      })
    }

    console.log('Initialized with context: ', ctx)
  }
}
