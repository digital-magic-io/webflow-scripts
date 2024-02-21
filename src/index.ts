// Application entry point
const getCarUrl = (plateNumber: string): string => `https://test.carprof.ee/api/v1/cars/mnt/${plateNumber}`

const idErrorMessage = 'error-message'
const idFormSearch = 'search-form'
const idInputPlateNumber = 'plateNumber'
const idFormVehicle = 'vehicle-form'
const idVehicleMake = 'make'
const idVehicleModel = 'model'

type VehicleMntSearchResponse = {
  engine?: string
  engineVolCm3?: string
  engineKw?: string
  firstRegYear?: string
  mark: string
  model: string
  nextInspectionDate?: string
  transmission?: string
  registrationNumber?: string
}

const getElById = <T extends HTMLElement>(id: string): T | undefined => {
  const el: HTMLElement | null = document.getElementById(id)
  if (el === null) {
    console.error(`Element with id "${id}" not found`)
    return undefined
  } else {
    return el as T
  }
}
const getInputById = (id: string): HTMLInputElement | undefined => getElById<HTMLInputElement>(id)
const setInputById = (id: string, value: string): void => {
  const input = getInputById(id)
  if (input) {
    input.value = value
  }
}

const getFormById = (id: string): HTMLFormElement | undefined => getElById<HTMLFormElement>(id)

const fetchTyped = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)
  return (await response.json()) as Promise<T>
}

const setupFormHandler = (formId: string, handler: (e: Event) => void): void => {
  const form = getFormById(formId)
  if (form) {
    form.action = ''
    form.method = ''
    form.addEventListener('submit', handler)
  } else {
    console.error(`Unable to find form with id "${idFormSearch}"`)
  }
}

const apiGetCar = (plateNumber: string): Promise<VehicleMntSearchResponse> => fetchTyped(getCarUrl(plateNumber))

const handleSubmitSearch = (e: Event): void => {
  e.preventDefault()
  const formData = e.target as HTMLFormElement
  console.log('Form submitted', formData)
  const plateNumber = getInputById(idInputPlateNumber)?.value
  if (plateNumber && plateNumber.length > 0) {
    console.log('Plate number:', plateNumber)
    apiGetCar(plateNumber)
      .then((response) => {
        console.log('Car response:', response)
        setInputById(idVehicleMake, response.mark)
        setInputById(idVehicleModel, response.model)
      })
      .catch((error) => {
        console.error('Car error:', error)
        const errMsg = getElById(idErrorMessage)
        if (errMsg) {
          errMsg.innerHTML = 'Car not found'
        }
      })
  }
}

const handleSubmitVehicle = (e: Event): void => {
  e.preventDefault()
  const formData = e.target as HTMLFormElement
  console.log('Form submitted', formData)
}

export const init = (): void => {
  setupFormHandler(idFormSearch, handleSubmitSearch)
  setupFormHandler(idFormVehicle, handleSubmitVehicle)
}

init()
