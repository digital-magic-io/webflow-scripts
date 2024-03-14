import { DmConfig } from './dmconfig'
import {
  apiGetCar,
  apiPostBuyout,
  apiPostClient,
  apiUploadFile,
  BuyoutRequest,
  ClientRequest,
  ClientResponse,
  fromFileList,
  uploadFilesList
} from './api'
import { getForm } from './dmdom'
import { validateEmail, validateNonEmpty } from './validators'
import { createFormInstance, DmFormInstance } from './dmform'
import { StateStorage } from './dmtypes'

type State = Readonly<{
  client: ClientResponse | undefined
  form: Partial<BuyoutRequest>
}>

type AppStateStorage = StateStorage<State>

type ClientFormInstance = DmFormInstance<'name' | 'email' | 'phone'>
type FindVehicleFormInstance = DmFormInstance<'plateNumber'>
type VehicleFormInstance = DmFormInstance<'make' | 'model' | 'year' | 'mileage' | 'location' | 'price' | 'message'>
type FilesFormInstance = DmFormInstance<'files'>

const handleSubmitClient =
  (conf: DmConfig, storage: AppStateStorage, form: ClientFormInstance) =>
  (e: Event): void => {
    console.log('Form submitted', e.target)
    form.clearAllErrors()
    const name = validateNonEmpty(form.fields.name)
    const email = validateEmail(form.fields.email)
    const phoneNumber = validateNonEmpty(form.fields.phone)

    if (!name || !email || !phoneNumber) {
      return
    }

    const client: ClientRequest = {
      formType: 'BUYOUT',
      name,
      email,
      phoneNumber,
      language: 'et'
    }

    void apiPostClient(client)
      .then((resp) => {
        storage.setState({ ...storage.state, client: resp })
        console.log(`State updated: ${JSON.stringify(storage)}`)
        conf.stepper.nextStepFn(1)
      })
      .catch((error) => {
        console.error('API error:', error)
        form.setError('Unable to send client data!')
      })
  }

const handleSubmitSearchVehicle =
  (storage: AppStateStorage, form: FindVehicleFormInstance, vehicleForm: VehicleFormInstance) =>
  (e: Event): void => {
    console.log('Form submitted', e.target)
    form.clearAllErrors()
    const plateNumber = validateNonEmpty(form.fields.plateNumber)

    if (!plateNumber) {
      return
    }

    console.log('Plate number:', plateNumber)

    apiGetCar(plateNumber)
      .then((response) => {
        console.log('Car response:', response)
        vehicleForm.fields.make.setInputValue(response.mark)
        vehicleForm.fields.model.setInputValue(response.model)
        vehicleForm.fields.year.setInputValue(String(response.firstRegYear))
        storage.setState({ ...storage.state, form: { ...storage.state.form, plateNumber } })
        console.log(`State updated: ${JSON.stringify(storage)}`)
        vehicleForm.show()
      })
      .catch((error) => {
        console.error('Car error:', error)
        form.fields.plateNumber.setError('Car not found!')
      })
  }

const handleSubmitVehicle =
  (conf: DmConfig, storage: AppStateStorage, form: VehicleFormInstance) =>
  (e: Event): void => {
    console.log('Form submitted', e.target)
    form.clearAllErrors()
    const make = validateNonEmpty(form.fields.make)
    const model = validateNonEmpty(form.fields.model)
    const year = validateNonEmpty(form.fields.year)
    const mileage = validateNonEmpty(form.fields.mileage)
    const location = form.fields.location?.input.el.value
    const price = validateNonEmpty(form.fields.price)
    const message = form.fields.message?.input.el.value

    if (!make || !model || !year || !mileage || !price) {
      return
    }

    if (storage.state.form.plateNumber === undefined) {
      throw new Error('Plate number is not set!')
    }

    const request: BuyoutRequest = {
      plateNumber: storage.state.form.plateNumber,
      make,
      model,
      year: Number(year),
      mileage: Number(mileage),
      location,
      price: Number(price),
      additionalInfo: message,
      photoIds: []
    }
    console.log(`Submitted: request=${JSON.stringify(request)}`)
    storage.setState({ ...storage.state, form: request })
    console.log(`State updated: ${JSON.stringify(storage)}`)
    conf.stepper.nextStepFn(2)
  }

const handleSubmitFiles =
  (conf: DmConfig, storage: AppStateStorage, form: FilesFormInstance) =>
  (e: Event): void => {
    console.log('Form submitted', e.target)
    form.clearAllErrors()
    const files = form.fields.files.input.el.files

    if (!files || files.length === 0) {
      form.fields.files.setError('Files must be selected!')
      return
    } else if (files && files.length > 10) {
      form.fields.files.setError('Maximum 10 files allowed!')
      return
    }

    console.log('Files:', files)
    const uploadFiles = uploadFilesList(apiUploadFile)
    void uploadFiles(fromFileList(files)).then((response) => {
      const photoIds = response.map((v) => v.fileId)
      storage.setState({ ...storage.state, form: { ...storage.state.form, photoIds } })
      console.log(`State updated: ${JSON.stringify(storage)}`)
      if (storage.state.client) {
        void apiPostBuyout(storage.state.client.personalDataId, storage.state.form as BuyoutRequest).then(() => {
          console.log('Success!')
          conf.stepper.nextStepFn(3)
        })
      } else {
        form.setError('Client is not set!')
      }
    })
  }

const initForm = <T extends string>(name: string, fieldNames: Array<T>): DmFormInstance<T> | undefined => {
  const form = getForm(name)
  if (form) {
    //form.setOnSubmit(handler(form))
    return createFormInstance(form, fieldNames)
  } else {
    // eslint-disable-next-line no-console
    console.error('Client form not found!')
    return undefined
  }
}

export const init = (conf: DmConfig): void => {
  console.log('Initializing...', conf)

  const storage: AppStateStorage = {
    state: {
      client: undefined,
      form: {}
    },
    setState(value: State): void {
      storage.state = value
    }
  }

  const clientForm: ClientFormInstance | undefined = initForm(conf.forms.client, ['name', 'email', 'phone'])
  const findVehicleForm: FindVehicleFormInstance | undefined = initForm(conf.forms.findVehicle, ['plateNumber'])
  const vehicleForm: VehicleFormInstance | undefined = initForm(conf.forms.vehicle, [
    'make',
    'model',
    'year',
    'mileage',
    'location',
    'price',
    'message'
  ])
  const filesForm: FilesFormInstance | undefined = initForm(conf.forms.files, ['files'])

  if (!clientForm || !findVehicleForm || !vehicleForm || !filesForm) {
    throw new Error('Not all forms are found!')
  }

  clientForm.setOnSubmit(handleSubmitClient(conf, storage, clientForm))
  findVehicleForm.setOnSubmit(handleSubmitSearchVehicle(storage, findVehicleForm, vehicleForm))
  vehicleForm.setOnSubmit(handleSubmitVehicle(conf, storage, vehicleForm))
  filesForm.setOnSubmit(handleSubmitFiles(conf, storage, filesForm))
}
