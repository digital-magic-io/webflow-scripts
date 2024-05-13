import { Config, FormConfig, PageContext } from '../core'
import { Handler, ManagedState } from '../core/types'

export type FormName = 'initial' | 'vehicle' | 'files'
export type ButtonName = 'updateVehicle'
export type LabelName = 'markAndModel' | 'plateNumber'

export type CpMessages = {
  internalError: string
  invalidPhoneError: string
  invalidEmailError: string
  vehicleNotFoundError: string
}

export type AppConfig = Config<FormName, ButtonName, LabelName>

export type CpFormConfig<V extends Record<string, unknown>> = FormConfig<FormName, ButtonName, LabelName, V>

export type CpPageContext = PageContext<FormName, ButtonName, LabelName>

export type ActionState = Readonly<{
  formId: ManagedState<string | undefined>
  messages: CpMessages
  captchaKey: string
}>

export type ActionParams<T extends Record<string, string | number | File | FileList | undefined>> = Readonly<{
  data: T
  ctx: CpPageContext
  success: Handler<void>
  fail: Handler<string>
  state: ActionState
}>

export type LookupVehicleForm = Readonly<{
  plateNumber: string
}>

export type InitialForm = Readonly<{
  phone: string
  plateNumber: string
}>

export type VehicleForm = Readonly<{
  //phone: string
  plateNumber: string
  make: string
  model: string
  mileage?: string
  location?: string
  price: string
  name?: string
  email?: string
}>

export type FileForm = Readonly<{
  files: FileList
}>
