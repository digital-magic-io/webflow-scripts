import type { ButtonConfig, Config, FormConfig, FormHandlers, LabelConfig, PageContext } from './config'
import type { FailedValidationType, FormErrorMessages } from './types'
import type { DmButton, DmForm, DmLabel } from './form'
import { createButton, createForm, createLabel } from './form'
import { getElement } from './dom'

export * from './fetch'
export * from './config'

const setupForm = <F extends string, B extends string, L extends string>(
  ctx: PageContext<F, B, L>,
  formName: F,
  formConfig: FormConfig<F, B, L, Record<string, unknown>>,
  globalErrorMessages: FormErrorMessages,
  handlers?: FormHandlers
): DmForm<F> => {
  const debug = ctx.debug

  if (debug) {
    // eslint-disable-next-line no-console
    console.debug('Form:', formName, formConfig)
  }
  const form = createForm(formConfig.selector, formName, { ...globalErrorMessages, ...formConfig.errorMessages }, debug)
  handlers?.init?.(form)
  form.setOnSubmit(async () => {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('Form submitted:', formName, form.fields, form.getFormValues())
    }
    handlers?.beforeSubmit?.(form)
    await formConfig
      .onSubmit(
        form.getFormValues(),
        ctx,
        () => formConfig.onSuccess(ctx),
        (error) => formConfig.onError(error, ctx)
      )
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Unhandled exception!', error)
        formConfig.onError('Unexpected error!', ctx)
      })
      .finally(() => {
        handlers?.afterSubmit?.(form)
      })
  })
  form.el.setAttribute('novalidate', 'true')
  return form
}

const setupButton = <F extends string, B extends string, L extends string>(
  ctx: PageContext<F, B, L>,
  buttonName: B,
  buttonConfig: ButtonConfig<F, B, L>
): DmButton => {
  const button = getElement<HTMLButtonElement>(buttonConfig.selector)
  if (button) {
    button.addEventListener('click', () => buttonConfig.onClick(ctx))
    const result = createButton(button)
    ctx.buttons[buttonName] = result
    return result
  } else {
    throw new Error('Button not found by selector: ' + buttonConfig.selector)
  }
}

const setupLabel = <F extends string, B extends string, L extends string>(
  ctx: PageContext<F, B, L>,
  labelName: L,
  labelConfig: LabelConfig
): DmLabel => {
  const label = getElement(labelConfig.selector)
  if (label) {
    const result = createLabel(label)
    ctx.labels[labelName] = result
    return result
  } else {
    throw new Error('Label not found by selector: ' + labelConfig.selector)
  }
}

const defaultErrors: Record<FailedValidationType, string> = {
  required: 'This field is required',
  minlength: 'Field length is too small',
  maxlength: 'Field length is too big',
  pattern: 'Field does not match the pattern',
  min: 'Field value is too small',
  max: 'Field value is too big'
}

export const init = <F extends string, B extends string, L extends string>(conf: Config<F, B, L>): void => {
  const debug = conf.debug ?? false

  if (debug) {
    // eslint-disable-next-line no-console
    console.log('Initializing...', conf)
  }

  const ctx: PageContext<F, B, L> = {
    forms: {},
    buttons: {},
    labels: {},
    debug
  } as PageContext<F, B, L>

  if (conf.forms) {
    // TODO: Update foreach to map or reduce
    Object.entries<FormConfig<F, B, L, Record<string, unknown>>>(conf.forms).forEach(([formName, formConfig]) => {
      ctx.forms[formName as F] = setupForm<F, B, L>(
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
      Object.entries<ButtonConfig<F, B, L>>(conf.buttons).forEach(([buttonName, buttonConfig]) => {
        setupButton(ctx, buttonName as B, buttonConfig)
      })
    }
    if (conf.labels) {
      Object.entries<LabelConfig>(conf.labels).forEach(([labelName, labelConfig]) => {
        setupLabel(ctx, labelName as L, labelConfig)
      })
    }

    conf.afterInit?.(ctx)

    if (debug) {
      // eslint-disable-next-line no-console
      console.log('Initialized with context: ', ctx)
    }
  }
}
