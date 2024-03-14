"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const api_1 = require("./api");
const dmdom_1 = require("./dmdom");
const validators_1 = require("./validators");
const dmform_1 = require("./dmform");
const handleSubmitClient = (conf, storage, form) => (e) => {
    console.log('Form submitted', e.target);
    form.clearAllErrors();
    const name = (0, validators_1.validateNonEmpty)(form.fields.name);
    const email = (0, validators_1.validateEmail)(form.fields.email);
    const phoneNumber = (0, validators_1.validateNonEmpty)(form.fields.phone);
    if (!name || !email || !phoneNumber) {
        return;
    }
    const client = {
        formType: 'BUYOUT',
        name,
        email,
        phoneNumber,
        language: 'et'
    };
    void (0, api_1.apiPostClient)(client)
        .then((resp) => {
        storage.setState({ ...storage.state, client: resp });
        console.log(`State updated: ${JSON.stringify(storage)}`);
        conf.stepper.nextStepFn(1);
    })
        .catch((error) => {
        console.error('API error:', error);
        form.setError('Unable to send client data!');
    });
};
const handleSubmitSearchVehicle = (form, vehicleForm) => (e) => {
    console.log('Form submitted', e.target);
    form.clearAllErrors();
    const plateNumber = (0, validators_1.validateNonEmpty)(form.fields.plateNumber);
    if (!plateNumber) {
        return;
    }
    console.log('Plate number:', plateNumber);
    (0, api_1.apiGetCar)(plateNumber)
        .then((response) => {
        console.log('Car response:', response);
        vehicleForm.fields.make.setInputValue(response.mark);
        vehicleForm.fields.model.setInputValue(response.model);
        vehicleForm.fields.year.setInputValue(String(response.firstRegYear));
        vehicleForm.show();
    })
        .catch((error) => {
        console.error('Car error:', error);
        form.fields.plateNumber.setError('Car not found!');
    });
};
const handleSubmitVehicle = (conf, form, storage) => (e) => {
    console.log('Form submitted', e.target);
    form.clearAllErrors();
    const make = (0, validators_1.validateNonEmpty)(form.fields.make);
    const model = (0, validators_1.validateNonEmpty)(form.fields.model);
    const year = (0, validators_1.validateNonEmpty)(form.fields.year);
    const mileage = (0, validators_1.validateNonEmpty)(form.fields.mileage);
    const location = form.fields.location?.input.el.value;
    const price = (0, validators_1.validateNonEmpty)(form.fields.price);
    const message = form.fields.message?.input.el.value;
    if (!make || !model || !year || !mileage || !price) {
        return;
    }
    if (storage.state.form.plateNumber === undefined) {
        throw new Error('Plate number is not set!');
    }
    const request = {
        plateNumber: storage.state.form.plateNumber,
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
    console.log(`State updated: ${JSON.stringify(storage)}`);
    conf.stepper.nextStepFn(2);
};
const handleSubmitFiles = (conf, storage, form) => (e) => {
    console.log('Form submitted', e.target);
    form.clearAllErrors();
    const files = form.fields.files.input.el.files;
    if (!files || files.length === 0) {
        form.fields.files.setError('Files must be selected!');
        return;
    }
    else if (files && files.length > 10) {
        form.fields.files.setError('Maximum 10 files allowed!');
        return;
    }
    console.log('Files:', files);
    const uploadFiles = (0, api_1.uploadFilesList)(api_1.apiUploadFile);
    void uploadFiles((0, api_1.fromFileList)(files)).then((response) => {
        const photoIds = response.map((v) => v.fileId);
        storage.setState({ ...storage.state, form: { ...storage.state.form, photoIds } });
        console.log(`State updated: ${JSON.stringify(storage)}`);
        if (storage.state.client) {
            void (0, api_1.apiPostBuyout)(storage.state.client.personalDataId, storage.state.form).then(() => {
                console.log('Success!');
                conf.stepper.nextStepFn(3);
            });
        }
        else {
            form.setError('Client is not set!');
        }
    });
};
const initForm = (name, fieldNames) => {
    const form = (0, dmdom_1.getForm)(name);
    if (form) {
        return (0, dmform_1.createFormInstance)(form, fieldNames);
    }
    else {
        console.error('Client form not found!');
        return undefined;
    }
};
const init = (conf) => {
    console.log('Initializing...', conf);
    const storage = {
        state: {
            client: undefined,
            form: {}
        },
        setState(value) {
            storage.state = value;
        }
    };
    const clientForm = initForm(conf.forms.client, ['name', 'email', 'phone']);
    const findVehicleForm = initForm(conf.forms.findVehicle, ['plateNumber']);
    const vehicleForm = initForm(conf.forms.vehicle, [
        'make',
        'model',
        'year',
        'mileage',
        'location',
        'price',
        'message'
    ]);
    const filesForm = initForm(conf.forms.files, ['files']);
    if (!clientForm || !findVehicleForm || !vehicleForm || !filesForm) {
        throw new Error('Not all forms are found!');
    }
    clientForm.setOnSubmit(handleSubmitClient(conf, storage, clientForm));
    findVehicleForm.setOnSubmit(handleSubmitSearchVehicle(findVehicleForm, vehicleForm));
    vehicleForm.setOnSubmit(handleSubmitVehicle(conf, vehicleForm, storage));
    filesForm.setOnSubmit(handleSubmitFiles(conf, storage, filesForm));
};
exports.init = init;
//# sourceMappingURL=index.js.map