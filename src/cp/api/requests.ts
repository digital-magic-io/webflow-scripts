import { getTyped, postTyped, uploadTypedArray, uploadTypedFileList } from '../../core'
import {
  FormDataRequest,
  FormPhotosRequest,
  InitialDataRequest,
  InitialDataResponse,
  LookupCarRegistryRequest
} from './types'

const apiUrl = 'https://test.carprof.ee/api'
const formsUrl = `${apiUrl}/v2/forms`
const initialFormUrl = `${formsUrl}/initial-data`
const lookupCarRegistryUrl = (plateNumber: string): string => `${apiUrl}/v1/cars/mnt/${plateNumber}`
const formDataUrl = (formId: string): string => `${formsUrl}/form-data/${formId}`
const photosUrl = (formId: string): string => `${formsUrl}/photos/${formId}`
const fileUrl = `${apiUrl}/v1/forms/file`

export const lookupCarRegistry = async (plateNumber: string): Promise<LookupCarRegistryRequest> =>
  getTyped(lookupCarRegistryUrl(plateNumber))

export const sendInitForm = (request: InitialDataRequest): Promise<InitialDataResponse> =>
  postTyped(initialFormUrl, request)

export const sendFormData = (formId: string, data: FormDataRequest): Promise<void> =>
  postTyped(formDataUrl(formId), data)

export const sendPhotos = (formId: string, data: FormPhotosRequest): Promise<void> => postTyped(photosUrl(formId), data)

export const uploadAndSendPhotos = async (formId: string, files: FileList | Array<File>): Promise<void> => {
  if (files instanceof FileList) {
    const fileIds = await uploadTypedFileList<{ fileId: string }>(fileUrl, files)
    await sendPhotos(formId, { imageIds: fileIds.map((v) => v.fileId) })
  } else if (Array.isArray(files)) {
    const fileIds = await uploadTypedArray<{ fileId: string }>(fileUrl, files)
    await sendPhotos(formId, { imageIds: fileIds.map((v) => v.fileId) })
  } else {
    throw new Error('Unable to upload files!')
  }
}
