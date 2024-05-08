import { Config, FormConfig, PageContext } from '../core/config'
import { FN, Handler } from '../core/types'

export type FormName = 'initial' | 'vehicle' | 'files'
export type ButtonName = 'manual'
export type LabelName = 'testLabel'

export type CpMessages = {
  internalError: string
  invalidPhoneError: string
  invalidEmailError: string
}

export type AppConfig = Config<FormName, ButtonName, LabelName>

export type CpFormConfig = FormConfig<FormName, ButtonName, LabelName>

export type CpPageContext = PageContext<FormName, ButtonName, LabelName>

export type ActionState = Readonly<{
  setFormId: Handler<string>
  getFormId: FN<void, string | undefined>
  messages: CpMessages
}>

export type ActionParams<T extends Record<string, string | number | File | FileList | undefined>> = Readonly<{
  data: T
  ctx: CpPageContext
  success: Handler<void>
  fail: Handler<unknown>
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
