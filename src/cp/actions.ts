import { ActionParams, ActionState, FileForm, InitialForm, LookupVehicleForm, VehicleForm } from './types'
import {
  ErrorResponse,
  lookupCarRegistry,
  sendFormData,
  sendInitForm,
  uploadAndSendPhotos,
  ValidationErrorResponse
} from './api'
import { getUrlQueryString, mapOrElse, mapValue } from '../core/utils'
import { ApiError, getErrorFromResponse } from '../core'
import { isValidationError } from './api/utils'

declare global {
  const grecaptcha: {
    ready: (callback: () => void) => void
    execute: (siteKey: string, options: { action: string }) => Promise<string>
  }

  function fbq(event: string, value: unknown): void
}

const fbTrackLead = (debug: boolean): void => {
  if (typeof fbq === 'function') {
    if (debug) {
      // eslint-disable-next-line no-console
      console.debug('Lead sent')
    }
    fbq('track', 'Lead')
  } else {
    if (debug) {
      // eslint-disable-next-line no-console
      console.debug('Lead not sent')
    }
  }
}

const validateFile =
  (state: ActionState) =>
  (file: File): string | undefined => {
    if (file.size > state.limits.maxFileSizeMb * 1024 * 1024) {
      return state.messages.fileToLargeError
    } else {
      return undefined
    }
  }

const validateFiles =
  (state: ActionState) =>
  (files: FileList): string | undefined => {
    if (files.length > state.limits.maxFilesCount) {
      return state.messages.filesTooMuchError
    } else {
      return Array.from(files)
        .map((file) => validateFile(state)(file))
        .find((error) => error !== undefined)
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
    if (ctx.debug) {
      // eslint-disable-next-line no-console
      console.debug('Initial form submitted', data)
    }

    ctx.forms.initial.clearAllErrors()

    const token = await grecaptcha.execute(state.captchaKey, { action: 'submit' })
    const resp = await sendInitForm({
      captchaToken: token,
      phoneNumber: data.phone,
      carNumber: data.plateNumber,
      language: 'et',
      formType: 'BUYOUT',
      formSource: 'CARBUY_ORIGIN',
      source: getUrlQueryString()
    })
    state.formId.set(resp.formUuid)
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
        const { errorCode } = await getErrorFromResponse<ErrorResponse>(e.response)
        if (errorCode === 'INVALID_PHONE_NUMBER') {
          ctx.forms.initial.fields.phone.setError(state.messages.invalidPhoneError)
        } else {
          // eslint-disable-next-line no-console
          console.error('Unknown API Error:', e)
          fail(state.messages.internalError)
        }
      } else if (e.response.status === 403) {
        fail('Captcha error')
      } else {
        // eslint-disable-next-line no-console
        console.error('Response error: ', e)
        fail(state.messages.internalError)
      }
    } else {
      // eslint-disable-next-line no-console
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
    if (ctx.debug) {
      // eslint-disable-next-line no-console
      console.debug('Reloading vehicle data for plate number:', plateNumber)
    }

    ctx.forms.vehicle.clearAllErrors()
    const resp = await lookupCarRegistry(plateNumber)
    if (resp) {
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
    if (e instanceof ApiError && e.response.status === 400) {
      const { errorCode } = await getErrorFromResponse<ErrorResponse>(e.response)
      if (errorCode === 'CAR_NOT_FOUND') {
        fail(state.messages.vehicleNotFoundError)
      } else {
        fail(state.messages.internalError)
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('Response error: ', e)
      fail(state.messages.internalError)
    }
  }
}

export const submitVehicleForm = async ({
  data,
  ctx,
  success,
  fail,
  state
}: ActionParams<VehicleForm>): Promise<void> => {
  const formId = state.formId.get()
  if (!formId) {
    throw new Error('FormId is missing')
  }
  try {
    if (ctx.debug) {
      // eslint-disable-next-line no-console
      console.debug('Vehicle form submitted', data)
    }

    ctx.forms.vehicle.clearAllErrors()
    await sendFormData(formId, {
      carNumber: data.plateNumber,
      mark: data.make,
      model: data.model,
      mileage: mapValue(data.mileage, Number),
      location: data.location,
      requestedPrice: Number(data.price),
      fullName: data.name,
      email: data.email,
      additionalInfo: data['more-info']
    })
    ctx.labels.markAndModel.setLabel(`${data.make}, ${data.model}`)
    ctx.labels.plateNumber.setLabel(data.plateNumber)
    success()
  } catch (e) {
    if (e instanceof ApiError && e.response.status === 400) {
      const error = await getErrorFromResponse<ValidationErrorResponse>(e.response)
      if (isValidationError(error)) {
        if (error.rows.some((row) => row.field === 'email')) {
          ctx.forms.vehicle.fields.email.setError(state.messages.invalidEmailError)
        } else {
          // eslint-disable-next-line no-console
          console.error('Validation error:', error)
          fail('Unhandled validation error: ' + error.rows.map((row) => row.message).join(', '))
        }
      } else {
        // eslint-disable-next-line no-console
        console.error('Unknown API Error:', e)
        fail(state.messages.internalError)
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('Response error:', e)
      fail(state.messages.internalError)
    }
  }
}

export const submitFiles = async ({ data, ctx, success, fail, state }: ActionParams<FileForm>): Promise<void> => {
  const formId = state.formId.get()
  if (!formId) {
    throw new Error('FormId is missing')
  }
  try {
    if (ctx.debug) {
      // eslint-disable-next-line no-console
      console.debug('Files submitted', data)
    }

    ctx.forms.files.clearAllErrors()
    if (data?.files) {
      if (data.files instanceof FileList && data.files.length > 0) {
        const error = validateFiles(state)(data.files)
        if (error) {
          fail(error)
          return
        } else {
          await uploadAndSendPhotos(formId, data.files)
        }
      } else if (data.files instanceof File) {
        const error = validateFile(state)(data.files)
        if (error) {
          fail(error)
          return
        } else {
          await uploadAndSendPhotos(formId, [data.files])
        }
      } else {
        if (!(data.files instanceof FileList)) {
          // eslint-disable-next-line no-console
          console.error('Invalid files submitted: ', data)
          fail(state.messages.internalError)
          return
        }
      }
    }
    ctx.resetAll()
    fbTrackLead(ctx.debug)
    success()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Response error:', e)
    fail(state.messages.internalError)
  }
}
