type Language = 'et' | 'ru' | 'en'

type FormType = 'BUYOUT'

type RequestOrigin = 'CARBUY_ORIGIN' | 'CARPROF_ORIGIN'

export type ErrorResponse = Readonly<{
  errorCode: string
  error: string
}>

export type ValidationErrorResponse = Readonly<{
  type: 'ARGUMENT_NOT_VALID'
  rows: ReadonlyArray<{
    field: string
    reason: string
    message: string
  }>
}>

export type CarRegistryData = Readonly<{
  mark: string
  model: string
  firstRegYear: number
  registrationNumber: string
}>

export type LookupCarRegistryRequest = CarRegistryData

export type InitialDataRequest = Readonly<{
  captchaToken: string
  phoneNumber: string
  carNumber: string
  language: Language
  formType: FormType
  formSource: RequestOrigin
  source: string
}>

export type InitialDataResponse = Readonly<{
  formUuid: string
  mntData: CarRegistryData
}>

export type FormDataRequest = Readonly<{
  carNumber: string
  mark: string
  model: string
  mileage?: number
  location?: string
  requestedPrice: number
  fullName?: string
  email?: string
  additionalInfo?: string
}>

export type FormPhotosRequest = Readonly<{
  imageIds: ReadonlyArray<string>
}>
