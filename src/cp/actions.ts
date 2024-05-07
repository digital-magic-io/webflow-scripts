import { ActionParams, FileForm, InitialForm, LookupVehicleForm, VehicleForm } from './types'
import { ErrorResponse, lookupCarRegistry, sendFormData, sendInitForm, uploadAndSendPhotos } from './api'
import { mapOrElse, mapValue } from '../core/utils'
import { ApiError, getErrorFromResponse } from '../core'

export const submitInitialForm = async ({
  data,
  ctx,
  success,
  fail,
  setFormId
}: ActionParams<InitialForm>): Promise<void> => {
  try {
    console.debug('Initial form submitted', data)
    ctx.forms.initial.clearAllErrors()
    const resp = await sendInitForm({
      phoneNumber: data.phone,
      carNumber: data.plateNumber,
      language: 'et',
      formType: 'BUYOUT'
    })
    console.debug('Initial form response', resp)
    setFormId(resp.formUuid)
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
    // TODO: Translate error messages!
    if (e instanceof ApiError) {
      const { errorCode, error } = await getErrorFromResponse<ErrorResponse>(e.response)
      console.error('Response error: ', error)
      if (errorCode === 'INVALID_PHONE_NUMBER') {
        fail('Invalid phone number')
      } else {
        fail('Failed to send data')
      }
    } else {
      console.error('Response error: ', e)
      fail('Failed to send data')
    }
  }
}

export const reloadVehicleFormData = async ({
  data: { plateNumber },
  ctx,
  success,
  fail
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
    // TODO: Translate error messages!
    console.error('Lookup error:', e)
    fail('Failed to load vehicle data')
  }
}

export const submitVehicleForm = async ({
  data,
  ctx,
  success,
  fail,
  formId
}: ActionParams<VehicleForm>): Promise<void> => {
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
    success()
  } catch (e) {
    console.error('Response error:', e)
    // TODO: Translate error messages!
    fail('Failed to send data')
  }
}

export const submitFiles = async ({ data, ctx, success, fail, formId }: ActionParams<FileForm>): Promise<void> => {
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
    // TODO: Translate error messages!
    console.error('Response error:', e)
    fail('Failed to send data')
  }
}
