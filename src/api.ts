type Language = 'et' | 'ru' | 'en'

type FormType = 'BUYOUT'

export type ClientPersonalData = {
  name: string
  email: string
  phoneNumber: string
  language: Language
}

export type ClientRequest = {
  formType: FormType
} & ClientPersonalData

export type FileUploadResponse = {
  fileId: string
}

export type VehicleMntSearchResponse = {
  engine?: {
    type: 'FUELS'
    value: number
  }
  engineVolCm3?: number
  engineKw?: number
  firstRegYear?: number
  mark: string
  model: string
  nextInspectionDate?: string
  transmission?: {
    type: 'TRANSMISSIONS'
    value: number
  }
  registrationNumber?: string
}

export type TranslationValueId = number

export type BuyoutRequest = {
  registrationNumber: string
  fuelId: TranslationValueId
  engineVolCm3?: number
  engineKw?: number
  imageIds: Array<string>
  make: string
  model: string
  mileage: number
  requestedPrice: number
  transmissionId: TranslationValueId
  nextInspectionDate?: string
  year: number
  location?: string
  additionalInfo?: string
}

const apiUrl = 'https://test.carprof.ee/api/v1'
const formsUrl = `${apiUrl}/forms`

const fileUrl = `${formsUrl}/file`
const clientUrl = `${formsUrl}/client`
const buyoutUrl = `${formsUrl}/buyout`
const lookupCarRegistryUrl = (plateNumber: string): string => `${apiUrl}/cars/mnt/${plateNumber}`

const fetchTyped = async <T>(url: string, init: RequestInit = { method: 'GET' }): Promise<T> => {
  const response = await fetch(url, { credentials: 'include', ...init })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${init.method} ${url}: ${response.status} ${response.statusText}`)
  } else {
    const responseText = await response.text()
    if (!responseText || responseText.length === 0) {
      return undefined as unknown as Promise<T>
    } else {
      return JSON.parse(responseText) as Promise<T>
    }
  }
}

const getTyped = async <T>(url: string): Promise<T> => fetchTyped(url)
const postTyped = async <T, R>(url: string, body: T): Promise<R> =>
  fetchTyped(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })

export const apiGetClient = (): Promise<ClientPersonalData> => getTyped(clientUrl)
export const apiPostClient = (request: ClientRequest): Promise<Response> => postTyped(clientUrl, request)

export const apiUploadFile = (file: File): Promise<FileUploadResponse> => {
  const data = new FormData()
  data.append('file', file)

  return fetchTyped(fileUrl, {
    method: 'POST',
    body: data
  })
}

export const apiPostBuyout = (request: BuyoutRequest): Promise<Response> => postTyped(buyoutUrl, request)

export const apiGetCar = (plateNumber: string): Promise<VehicleMntSearchResponse> =>
  getTyped(lookupCarRegistryUrl(plateNumber))

export type FN<T, R> = (value: T) => R
export type Handler<T> = FN<T, void>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NullableType<T = NonNullable<any>> = T | null | undefined
export const isEmpty = <T>(value: NullableType<T>): value is null | undefined => value === null || value === undefined
export const hasValue = <T>(value: NullableType<T>): value is T => !isEmpty(value)

export const fromFileList = (files: NullableType<FileList>): Array<File> => {
  const result: Array<File> = []
  if (hasValue(files)) {
    for (const file of files) {
      result.push(file)
    }
  }
  return result
}

export const uploadFilesList =
  <TUploadResult>(
    upload: FN<File, Promise<TUploadResult>>,
    onFileUploadSuccess?: Handler<void>,
    onFileUploadError?: Handler<unknown>
  ): FN<Array<File>, Promise<Array<TUploadResult>>> =>
  (files) =>
    Promise.all(
      files.map((file) =>
        upload(file)
          .then((result) => {
            onFileUploadSuccess?.()
            return result
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.error('File upload error', e)
            onFileUploadError?.(e)
            return undefined
          })
      )
    ).then((result) => result.filter(hasValue))
