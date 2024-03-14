type DmConfig = {
    stepper: {
        steps: number;
        nextStepFn: (step: number) => void;
        prevStepFn: (step: number) => void;
    };
    forms: {
        client: string;
        findVehicle: string;
        vehicle: string;
        files: string;
    };
};
export const init: (conf: DmConfig) => void;

//# sourceMappingURL=types.d.ts.map
