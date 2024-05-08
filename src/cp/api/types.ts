type Language = 'et' | 'ru' | 'en'

type FormType = 'BUYOUT'

export type ErrorResponse = Readonly<{
  errorCode: string
  error: string
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
}>

export type FormPhotosRequest = Readonly<{
  imageIds: ReadonlyArray<string>
}>
