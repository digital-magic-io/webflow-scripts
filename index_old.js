"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const api_1 = require("./api");
const wfdom_1 = require("./wfdom");
const state = {
    client: undefined,
    form: {}
};
const handleSubmitClient = (stepper, f) => (e) => {
    console.log('Form submitted', e.target);
    (0, wfdom_1.setMsg)(f.msgError, '');
    const client = {
        formType: 'BUYOUT',
        name: (0, wfdom_1.getInput)(f.txtName)?.value ?? '',
        email: (0, wfdom_1.getInput)(f.txtEmail)?.value ?? '',
        phoneNumber: (0, wfdom_1.getInput)(f.txtPhone)?.value ?? '',
        language: 'et'
    };
    if (client.name && client.email && client.phoneNumber) {
        void (0, api_1.apiPostClient)(client)
            .then((resp) => {
            state.client = resp;
            console.log(`State updated: ${JSON.stringify(state)}`);
            stepper.nextStepFn(1);
        })
            .catch((error) => {
            console.error('API error:', error);
            (0, wfdom_1.setMsg)(f.msgError, 'Unable to send client data!');
        });
    }
    else {
        (0, wfdom_1.setMsg)(f.msgError, 'All fields must be filled!');
    }
};
const handleSubmitSearchVehicle = (f) => (e) => {
    console.log('Form submitted', e.target);
    (0, wfdom_1.setMsg)(f.plateNumber.msgError, '');
    const plateNumber = (0, wfdom_1.getInput)(f.plateNumber.txtPlateNumber)?.value;
    if (plateNumber && plateNumber.length > 0) {
        console.log('Plate number:', plateNumber);
        (0, api_1.apiGetCar)(plateNumber)
            .then((response) => {
            console.log('Car response:', response);
            (0, wfdom_1.setInput)(f.txtMake, response.mark);
            (0, wfdom_1.setInput)(f.txtModel, response.model);
            (0, wfdom_1.setInput)(f.txtYear, String(response.firstRegYear));
            (0, wfdom_1.showElement)(f.form);
        })
            .catch((error) => {
            console.error('Car error:', error);
            (0, wfdom_1.setMsg)(f.plateNumber.msgError, 'Car not found!');
        });
    }
    else {
        (0, wfdom_1.setMsg)(f.plateNumber.msgError, 'Plate number must be filled!');
    }
};
const handleSubmitVehicle = (stepper, f) => (e) => {
    console.log('Form submitted', e.target);
    (0, wfdom_1.setMsg)(f.msgError, '');
    const make = (0, wfdom_1.getInput)(f.txtMake)?.value;
    const model = (0, wfdom_1.getInput)(f.txtModel)?.value;
    const year = (0, wfdom_1.getInput)(f.txtYear)?.value;
    const mileage = (0, wfdom_1.getInput)(f.txtMileage)?.value;
    const location = (0, wfdom_1.getInput)(f.txtLocation)?.value;
    const price = (0, wfdom_1.getInput)(f.txtPrice)?.value;
    const message = (0, wfdom_1.getInput)(f.txtMessage)?.value;
    const plateNumber = (0, wfdom_1.getInput)(f.plateNumber.txtPlateNumber)?.value;
    if (make && model && year && mileage && price && plateNumber) {
        const request = {
            plateNumber,
            make,
            model,
            year: Number(year),
            mileage: Number(mileage),
            location,
            price: Number(price),
            additionalInfo: message,
            photoIds: []
        };
        console.log(`Submitted: request=${JSON.stringify(request)}`);
        state.form = request;
        console.log(`State updated: ${JSON.stringify(state)}`);
        stepper.nextStepFn(2);
    }
    else {
        (0, wfdom_1.setMsg)(f.msgError, 'All vehicle fields must be filled except message!');
    }
};
const handleSubmitFiles = (stepper, f) => (e) => {
    console.log('Form submitted', e.target);
    (0, wfdom_1.setMsg)(f.msgError, '');
    const files = (0, wfdom_1.getInput)(f.inputFiles)?.files;
    if (files && files.length > 0) {
        console.log('Files:', files);
        const uploadFiles = (0, api_1.uploadFilesList)(api_1.apiUploadFile);
        void uploadFiles((0, api_1.fromFileList)(files)).then((response) => {
            state.form.photoIds = response.map((v) => v.fileId);
            console.log(`State updated: ${JSON.stringify(state)}`);
            if (state.client) {
                void (0, api_1.apiPostBuyout)(state.client.personalDataId, state.form).then(() => {
                    console.log('Success!');
                    stepper.nextStepFn(3);
                });
            }
            else {
                (0, wfdom_1.setMsg)(f.msgError, 'client is not set!');
            }
        });
    }
    else if (files && files.length > 10) {
        (0, wfdom_1.setMsg)(f.msgError, 'Too many files selected!');
    }
    else {
        (0, wfdom_1.setMsg)(f.msgError, 'Files must be selected!');
    }
};
const init = (conf) => {
    console.log('Initializing...', conf);
    (0, wfdom_1.setupFormHandler)(conf.elements.stepClient.form, handleSubmitClient(conf.stepper, conf.elements.stepClient));
    (0, wfdom_1.setupFormHandler)(conf.elements.stepVehicle.plateNumber.form, handleSubmitSearchVehicle(conf.elements.stepVehicle));
    (0, wfdom_1.setupFormHandler)(conf.elements.stepVehicle.form, handleSubmitVehicle(conf.stepper, conf.elements.stepVehicle));
    (0, wfdom_1.setupFormHandler)(conf.elements.stepFiles.form, handleSubmitFiles(conf.stepper, conf.elements.stepFiles));
};
exports.init = init;
//# sourceMappingURL=index_old.js.map