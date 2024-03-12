export type WfContainer = {
  wfId: string
}

export type WfInput = {
  wfName: string
}

// input.label
// input.control
// input.error
// input.value

export type WfForm = WfContainer & {
  msgError: string
  inputs: Array<WfInput>
}

export type WfElements = {
  stepClient: {
    form: string
    msgError: string
    txtName: string
    txtEmail: string
    txtPhone: string
    btnSubmit: string
  }
  stepVehicle: {
    plateNumber: {
      form: string
      msgError: string
      txtPlateNumber: string
      btnSubmit: string
    }
    form: string
    msgError: string
    txtMake: string
    txtModel: string
    txtYear: string
    txtMileage: string
    txtLocation: string
    txtPrice: string
    txtMessage: string
    btnSubmit: string
  }
  stepFiles: {
    form: string
    msgError: string
    inputFiles: string
    btnSubmit: string
  }
  msgSuccess: string
}

export type WfConfiguration = {
  stepper: {
    steps: number
    nextStepFn: (step: number) => void
    prevStepFn: (step: number) => void
  }
  elements: WfElements
}
