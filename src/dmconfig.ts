export type DmConfig = {
  /*
  dom: {
    idAttr: string
    typeAttr: string
    nameAttr: string
    setFieldState: (selector: string, state: DmFieldState) => void
  }
  */
  stepper: {
    steps: number
    nextStepFn: (step: number) => void
    prevStepFn: (step: number) => void
  }
  forms: {
    client: string
    findVehicle: string
    vehicle: string
    files: string
  }
}
