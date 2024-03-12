import { DmConfig } from './dmconfig'
import { apiGetCar, apiPostClient, BuyoutRequest, ClientRequest, ClientResponse } from './api'
import { getForm } from './dmdom'
import { validateEmail, validateNonEmpty } from './validators'
import { createFormInstance, DmFormInstance } from './dmform'

type State = {
  client: ClientResponse | undefined
  form: Partial<BuyoutRequest>
}

// TODO: Use functional State pattern
const state: State = {
  client: undefined,
  form: {}
}

type ClientFormInstance = DmFormInstance<'name' | 'email' | 'phone'>
type FindVehicleFormInstance = DmFormInstance<'plateNumber'>
type VehicleFormInstance = DmFormInstance<'make' | 'model' | 'year' | 'mileage' | 'location' | 'price'>

const handleSubmitClient =
  (conf: DmConfig, form: ClientFormInstance) =>
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
        state.client = resp
        console.log(`State updated: ${JSON.stringify(state)}`)
        conf.stepper.nextStepFn(1)
      })
      .catch((error) => {
        console.error('API error:', error)
        form.setError('Unable to send client data!')
      })
  }

const handleSubmitSearchVehicle =
  (form: FindVehicleFormInstance, vehicleForm: VehicleFormInstance) =>
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
        vehicleForm.show()
      })
      .catch((error) => {
        console.error('Car error:', error)
        form.fields.plateNumber.setError('Car not found!')
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
  //const { dom, stepper, forms } = conf

  const clientForm: ClientFormInstance = initForm(conf.forms.client, ['name', 'email', 'phone'])
  const findVehicleForm: FindVehicleFormInstance = initForm(conf.forms.findVehicle, ['plateNumber'])
  const vehicleForm: VehicleFormInstance = initForm(conf.forms.vehicle, [
    'make',
    'model',
    'year',
    'mileage',
    'location',
    'price'
  ])
  if (!clientForm || !findVehicleForm || !vehicleForm) {
    throw new Error('Not all forms are found!')
  }
  clientForm.setOnSubmit(handleSubmitClient(conf, clientForm))

  findVehicleForm.setOnSubmit(handleSubmitSearchVehicle(findVehicleForm, vehicleForm))
}
