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
        plateNumber: {
            form: string;
            msgError: string;
            txtPlateNumber: string;
            btnSubmit: string;
        };
        form: string;
        msgError: string;
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
export const init: (conf: WfConfiguration) => void;

//# sourceMappingURL=types.d.ts.map
