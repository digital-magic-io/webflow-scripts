import { apiGetCar, apiGetClient, apiPostClient, ClientPersonalData } from './api'
import { getInput, setErrorMsg, setInput, setupFormHandler } from './wfdom'
import { WfConfiguration } from './wfconfig'

const handleSubmitClient =
  (stepper: WfConfiguration['stepper'], f: WfConfiguration['elements']['stepClient']) =>
  (e: Event): void => {
    console.log('Form submitted', e.target)
    const client: ClientPersonalData = {
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
          setErrorMsg(f.msgError, 'Unable to send client data!')
        })
    } else {
      setErrorMsg(f.msgError, 'All fields must be filled!')
    }
  }

const handleSubmitSearchVehicle =
  (f: WfConfiguration['elements']['stepVehicle']) =>
  (e: Event): void => {
    console.log('Form submitted', e.target)
    const plateNumber = getInput(f.plateNumber.txtPlateNumber)?.value
    if (plateNumber && plateNumber.length > 0) {
      console.log('Plate number:', plateNumber)
      apiGetCar(plateNumber)
        .then((response) => {
          console.log('Car response:', response)
          setInput(f.txtMake, response.mark)
          setInput(f.txtModel, response.model)
        })
        .catch((error) => {
          console.error('Car error:', error)
          setErrorMsg(f.plateNumber.msgError, 'Car not found!')
        })
    } else {
      setErrorMsg(f.plateNumber.msgError, 'Plate number must be filled!')
    }
  }

const handleSubmitVehicle =
  (f: WfConfiguration['elements']['stepVehicle']) =>
  (e: Event): void => {
    console.log('Form submitted', e.target)
    const make = getInput(f.txtMake)?.value
    const model = getInput(f.txtModel)?.value
    if (make && model) {
      console.log(`Submitted: make=${make}, model=${model}`)
    } else {
      setErrorMsg(f.msgError, 'Make and model must be filled!')
    }
  }

const handleSubmitFiles =
  (f: WfConfiguration['elements']['stepFiles']) =>
  (e: Event): void => {
    console.log('Form submitted', e.target)
    const files = getInput(f.inputFiles)?.files
    if (files && files.length > 0) {
      console.log('Files:', files)
    } else if (files && files.length > 10) {
      setErrorMsg(f.msgError, 'Too many files selected!')
    } else {
      setErrorMsg(f.msgError, 'Files must be selected!')
    }
  }

export const init = (conf: WfConfiguration): void => {
  console.log('Initializing...', conf)
  void apiGetClient().then((client) => {
    console.log('Client', client)
    setupFormHandler(conf.elements.stepClient.form, handleSubmitClient(conf.stepper, conf.elements.stepClient))
    setupFormHandler(conf.elements.stepVehicle.plateNumber.form, handleSubmitSearchVehicle(conf.elements.stepVehicle))
    setupFormHandler(conf.elements.stepVehicle.form, handleSubmitVehicle(conf.elements.stepVehicle))
    setupFormHandler(conf.elements.stepFiles.form, handleSubmitFiles(conf.elements.stepFiles))
  })

  //dom.setupFormHandler(conf.stepVehicle, handleSubmitSearch(dom))
  //dom.setupFormHandler(idFormVehicle, handleSubmitVehicle(dom))
}
