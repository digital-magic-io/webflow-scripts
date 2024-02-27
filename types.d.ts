type WfElements = {
    stepClient: {
        form: string;
        msgError: string;
        txtName: string;
        txtEmail: string;
        txtPhone: string;
        btnSubmit: string;
    };
    stepVehicle: {
        form: string;
        msgError: string;
        txtPlateNumber: string;
        txtMake: string;
        txtModel: string;
        btnSubmit: string;
    };
    msgSuccess: string;
};
type WfConfiguration = {
    stepper: {
        steps: number;
        nextStepFn: (step: number) => void;
        prevStepFn: (step: number) => void;
    };
    elements: WfElements;
};
export const init: (conf: WfConfiguration) => Promise<void>;

//# sourceMappingURL=types.d.ts.map
