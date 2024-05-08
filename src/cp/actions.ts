import { ActionParams, FileForm, InitialForm, LookupVehicleForm, VehicleForm } from './types'
import { ErrorResponse, lookupCarRegistry, sendFormData, sendInitForm, uploadAndSendPhotos } from './api'
import { mapOrElse, mapValue } from '../core/utils'
import { ApiError, getErrorFromResponse } from '../core'

declare global {
  const grecaptcha: {
    ready: (callback: () => void) => void
    execute: (siteKey: string, options: { action: string }) => Promise<string>
  }
}

export const submitInitialForm = async ({
  data,
  ctx,
  success,
  fail,
  state
}: ActionParams<InitialForm>): Promise<void> => {
  try {
    console.debug('Initial form submitted', data)
    ctx.forms.initial.clearAllErrors()

    const token = state.captchaKey ? await grecaptcha.execute(state.captchaKey, { action: 'submit' }) : undefined
    const resp = await sendInitForm({
      captchaToken: token,
      phoneNumber: data.phone,
      carNumber: data.plateNumber,
      language: 'et',
      formType: 'BUYOUT'
    })
    console.debug('Initial form response', resp)
    state.setFormId(resp.formUuid)
    if (resp.mntData) {
      const { mark, model, firstRegYear, registrationNumber } = resp.mntData
      ctx.forms.vehicle.setFormValues({
        phone: data.phone,
        make: mark,
        model,
        year: mapOrElse(firstRegYear, String, ''),
        plateNumber: registrationNumber
      })
    } else {
      ctx.forms.vehicle.setFormValues({
        phone: data.phone,
        plateNumber: data.plateNumber
      })
    }
    success()
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.response.status === 400) {
        const { errorCode, error } = await getErrorFromResponse<ErrorResponse>(e.response)
        console.error('Response error: ', error)
        if (errorCode === 'INVALID_PHONE_NUMBER') {
          fail(state.messages.invalidPhoneError)
        } else {
          fail(state.messages.internalError)
        }
      } else if (e.response.status === 403) {
        console.error('Response error: ', e)
        fail('Captcha error')
      } else {
        console.error('Response error: ', e)
        fail(state.messages.internalError)
      }
    } else {
      console.error('Response error: ', e)
      fail(state.messages.internalError)
    }
  }
}

export const reloadVehicleFormData = async ({
  data: { plateNumber },
  ctx,
  success,
  fail,
  state
}: ActionParams<LookupVehicleForm>): Promise<void> => {
  try {
    console.debug('Reloading vehicle data for plate number:', plateNumber)
    ctx.forms.vehicle.clearAllErrors()
    const resp = await lookupCarRegistry(plateNumber)
    if (resp) {
      console.debug('Lookup response:', resp)
      const { mark, model, firstRegYear, registrationNumber } = resp
      ctx.forms.vehicle.setFormValues({
        make: mark,
        model,
        year: mapOrElse(firstRegYear, String, ''),
        plateNumber: registrationNumber
      })
      success()
    }
  } catch (e) {
    console.error('Lookup error:', e)
    fail(state.messages.internalError)
  }
}

export const submitVehicleForm = async ({
  data,
  ctx,
  success,
  fail,
  state
}: ActionParams<VehicleForm>): Promise<void> => {
  const formId = state.getFormId()
  if (!formId) {
    throw new Error('FormId is missing')
  }
  try {
    console.debug('Vehicle form submitted', data)
    ctx.forms.vehicle.clearAllErrors()
    const response = await sendFormData(formId, {
      carNumber: data.plateNumber,
      mark: data.make,
      model: data.model,
      mileage: mapValue(data.mileage, Number),
      location: data.location,
      requestedPrice: Number(data.price),
      fullName: data.name,
      email: data.email
    })
    console.debug('Vehicle form response', response)
    ctx.labels.markAndModel.setLabel(`${data.make}, ${data.model}`)
    ctx.labels.plateNumber.setLabel(data.plateNumber)
    success()
  } catch (e) {
    console.error('Response error:', e)
    fail(state.messages.internalError)
  }
}

export const submitFiles = async ({ data, ctx, success, fail, state }: ActionParams<FileForm>): Promise<void> => {
  const formId = state.getFormId()
  if (!formId) {
    throw new Error('FormId is missing')
  }
  try {
    console.debug('Files submitted', data)
    ctx.forms.files.clearAllErrors()
    if (data?.files && data.files.length > 0) {
      await uploadAndSendPhotos(formId, data.files)
    }
    ctx.resetAll()
    success()
  } catch (e) {
    console.error('Response error:', e)
    fail(state.messages.internalError)
  }
}
