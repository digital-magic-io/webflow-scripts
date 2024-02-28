import {
  apiGetCar,
  apiGetClient,
  apiPostBuyout,
  apiPostClient,
  apiUploadFile,
  BuyoutRequest,
  ClientRequest,
  fromFileList,
  uploadFilesList
} from './api'
import { getInput, setMsg, setInput, setupFormHandler } from './wfdom'
import { WfConfiguration } from './wfconfig'

type State = {
  form: Partial<BuyoutRequest>
}

// TODO: Use functional State pattern
const state: State = {
  form: {}
}

const handleSubmitClient =
  (stepper: WfConfiguration['stepper'], f: WfConfiguration['elements']['stepClient']) =>
  (e: Event): void => {
    console.log('Form submitted', e.target)
    setMsg(f.msgError, '')
    const client: ClientRequest = {
      formType: 'BUYOUT',
      name: getInput(f.txtName)?.value ?? '',
      email: getInput(f.txtEmail)?.value ?? '',
      phoneNumber: getInput(f.txtPhone)?.value ?? '',
      language: 'et'
    }
    if (client.name && client.email && client.phoneNumber) {
      void apiPostClient(client)
        .then(() => {
          stepper.nextStepFn(1)
        })
        .catch((error) => {
          console.error('API error:', error)
          setMsg(f.msgError, 'Unable to send client data!')
        })
    } else {
      setMsg(f.msgError, 'All fields must be filled!')
    }
  }

const handleSubmitSearchVehicle =
  (f: WfConfiguration['elements']['stepVehicle']) =>
  (e: Event): void => {
    console.log('Form submitted', e.target)
    setMsg(f.plateNumber.msgError, '')
    const plateNumber = getInput(f.plateNumber.txtPlateNumber)?.value
    if (plateNumber && plateNumber.length > 0) {
      console.log('Plate number:', plateNumber)
      apiGetCar(plateNumber)
        .then((response) => {
          console.log('Car response:', response)
          setInput(f.txtMake, response.mark)
          setInput(f.txtModel, response.model)
          setInput(f.txtYear, String(response.firstRegYear))
          //setInput(f.txtMileage, )
          //setInput(f.txtLocation, )
          //setInput(f.txtPrice)
          //setInput()
        })
        .catch((error) => {
          console.error('Car error:', error)
          setMsg(f.plateNumber.msgError, 'Car not found!')
        })
    } else {
      setMsg(f.plateNumber.msgError, 'Plate number must be filled!')
    }
  }

const handleSubmitVehicle =
  (stepper: WfConfiguration['stepper'], f: WfConfiguration['elements']['stepVehicle']) =>
  (e: Event): void => {
    console.log('Form submitted', e.target)
    setMsg(f.msgError, '')
    const make = getInput(f.txtMake)?.value
    const model = getInput(f.txtModel)?.value
    const year = getInput(f.txtYear)?.value
    const mileage = getInput(f.txtMileage)?.value
    const location = getInput(f.txtLocation)?.value
    const price = getInput(f.txtPrice)?.value
    const message = getInput(f.txtMessage)?.value
    const plateNumber = getInput(f.plateNumber.txtPlateNumber)?.value
    if (make && model && year && mileage && price && plateNumber) {
      const request: BuyoutRequest = {
        registrationNumber: plateNumber,
        fuelId: 1,
        transmissionId: 1,
        imageIds: [],
        make,
        model,
        year: Number(year), // TODO: Use safe parse
        mileage: Number(mileage),
        location,
        requestedPrice: Number(price),
        additionalInfo: message
      }
      console.log(`Submitted: request=${JSON.stringify(request)}`)
      state.form = request
      console.log(`State updated: ${JSON.stringify(state)}`)
      stepper.nextStepFn(2)
    } else {
      setMsg(f.msgError, 'All vehicle fields must be filled except message!')
    }
  }

const handleSubmitFiles =
  (f: WfConfiguration['elements']['stepFiles'], msgSuccess: string) =>
  (e: Event): void => {
    console.log('Form submitted', e.target)
    setMsg(f.msgError, '')
    const files = getInput(f.inputFiles)?.files
    if (files && files.length > 0) {
      console.log('Files:', files)
      const uploadFiles = uploadFilesList(apiUploadFile)
      void uploadFiles(fromFileList(files)).then((response) => {
        state.form.imageIds = response.map((v) => v.fileId)
        console.log(`State updated: ${JSON.stringify(state)}`)
        void apiPostBuyout(state.form as BuyoutRequest).then(() => {
          console.log('Success!')
          setMsg(msgSuccess, 'Great success!')
        })
      })
    } else if (files && files.length > 10) {
      setMsg(f.msgError, 'Too many files selected!')
    } else {
      setMsg(f.msgError, 'Files must be selected!')
    }
  }

export const init = (conf: WfConfiguration): void => {
  console.log('Initializing...', conf)
  void apiGetClient().then((client) => {
    console.log('Client', client)
    setupFormHandler(conf.elements.stepClient.form, handleSubmitClient(conf.stepper, conf.elements.stepClient))
    setupFormHandler(conf.elements.stepVehicle.plateNumber.form, handleSubmitSearchVehicle(conf.elements.stepVehicle))
    setupFormHandler(conf.elements.stepVehicle.form, handleSubmitVehicle(conf.stepper, conf.elements.stepVehicle))
    setupFormHandler(conf.elements.stepFiles.form, handleSubmitFiles(conf.elements.stepFiles, conf.elements.msgSuccess))
  })
}
