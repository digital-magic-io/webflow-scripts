type Language = 'et' | 'ru' | 'en'

type FormType = 'BUYOUT'

export type ClientPersonalData = {
  formType: FormType
  name: string
  email: string
  phoneNumber: string
  language: Language
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

const lookupCarRegistryUrl = (plateNumber: string): string => `https://test.carprof.ee/api/v1/cars/mnt/${plateNumber}`
const clientUrl = 'https://test.carprof.ee/api/v1/forms/client'

const fetchTyped = async <T>(url: string, init: RequestInit = { method: 'GET' }): Promise<T> => {
  const response = await fetch(url, init)
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

export const apiGetCar = (plateNumber: string): Promise<VehicleMntSearchResponse> =>
  getTyped(lookupCarRegistryUrl(plateNumber))

export const apiGetClient = (): Promise<ClientPersonalData> => getTyped(clientUrl)
export const apiPostClient = (client: ClientPersonalData): Promise<Response> => postTyped(clientUrl, client)
