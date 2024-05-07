import { PageContext } from '../core/config'
import { Handler } from '../core/types'

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

export type FormName = 'initial' | 'vehicle' | 'files'
export type ButtonName = 'manual'
export type LabelName = 'testLabel'

export type CpPageContext = PageContext<FormName, ButtonName, LabelName>

export type ActionParams<T extends Record<string, string | number | undefined>> = Readonly<{
  data: T
  ctx: CpPageContext
  success: Handler<void>
  fail: Handler<unknown>
  setFormId: Handler<string>
  formId: string | undefined
}>
