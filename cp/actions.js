"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitFiles = exports.submitVehicleForm = exports.reloadVehicleFormData = exports.submitInitialForm = void 0;
const api_1 = require("./api");
const utils_1 = require("../core/utils");
const core_1 = require("../core");
const submitInitialForm = async ({ data, ctx, success, fail, state }) => {
    try {
        console.debug('Initial form submitted', data);
        ctx.forms.initial.clearAllErrors();
        const token = await grecaptcha.execute(state.captchaKey, { action: 'submit' });
        const resp = await (0, api_1.sendInitForm)({
            captchaToken: token,
            phoneNumber: data.phone,
            carNumber: data.plateNumber,
            language: 'et',
            formType: 'BUYOUT',
            formSource: 'CARBUY_ORIGIN'
        });
        console.debug('Initial form response', resp);
        state.formId.set(resp.formUuid);
        if (resp.mntData) {
            const { mark, model, firstRegYear, registrationNumber } = resp.mntData;
            ctx.forms.vehicle.setFormValues({
                phone: data.phone,
                make: mark,
                model,
                year: (0, utils_1.mapOrElse)(firstRegYear, String, ''),
                plateNumber: registrationNumber
            });
        }
        else {
            ctx.forms.vehicle.setFormValues({
                phone: data.phone,
                plateNumber: data.plateNumber
            });
        }
        success();
    }
    catch (e) {
        if (e instanceof core_1.ApiError) {
            if (e.response.status === 400) {
                const { errorCode } = await (0, core_1.getErrorFromResponse)(e.response);
                if (errorCode === 'INVALID_PHONE_NUMBER') {
                    fail(state.messages.invalidPhoneError);
                }
                else {
                    fail(state.messages.internalError);
                }
            }
            else if (e.response.status === 403) {
                fail('Captcha error');
            }
            else {
                console.error('Response error: ', e);
                fail(state.messages.internalError);
            }
        }
        else {
            console.error('Response error: ', e);
            fail(state.messages.internalError);
        }
    }
};
exports.submitInitialForm = submitInitialForm;
const reloadVehicleFormData = async ({ data: { plateNumber }, ctx, success, fail, state }) => {
    try {
        console.debug('Reloading vehicle data for plate number:', plateNumber);
        ctx.forms.vehicle.clearAllErrors();
        const resp = await (0, api_1.lookupCarRegistry)(plateNumber);
        if (resp) {
            console.debug('Lookup response:', resp);
            const { mark, model, firstRegYear, registrationNumber } = resp;
            ctx.forms.vehicle.setFormValues({
                make: mark,
                model,
                year: (0, utils_1.mapOrElse)(firstRegYear, String, ''),
                plateNumber: registrationNumber
            });
            success();
        }
    }
    catch (e) {
        if (e instanceof core_1.ApiError && e.response.status === 400) {
            const { errorCode } = await (0, core_1.getErrorFromResponse)(e.response);
            if (errorCode === 'CAR_NOT_FOUND') {
                fail(state.messages.vehicleNotFoundError);
            }
            else {
                fail(state.messages.internalError);
            }
        }
        else {
            console.error('Response error: ', e);
            fail(state.messages.internalError);
        }
    }
};
exports.reloadVehicleFormData = reloadVehicleFormData;
const submitVehicleForm = async ({ data, ctx, success, fail, state }) => {
    const formId = state.formId.get();
    if (!formId) {
        throw new Error('FormId is missing');
    }
    try {
        console.debug('Vehicle form submitted', data);
        ctx.forms.vehicle.clearAllErrors();
        const response = await (0, api_1.sendFormData)(formId, {
            carNumber: data.plateNumber,
            mark: data.make,
            model: data.model,
            mileage: (0, utils_1.mapValue)(data.mileage, Number),
            location: data.location,
            requestedPrice: Number(data.price),
            fullName: data.name,
            email: data.email
        });
        console.debug('Vehicle form response', response);
        ctx.labels.markAndModel.setLabel(`${data.make}, ${data.model}`);
        ctx.labels.plateNumber.setLabel(data.plateNumber);
        success();
    }
    catch (e) {
        console.error('Response error:', e);
        fail(state.messages.internalError);
    }
};
exports.submitVehicleForm = submitVehicleForm;
const submitFiles = async ({ data, ctx, success, fail, state }) => {
    const formId = state.formId.get();
    if (!formId) {
        throw new Error('FormId is missing');
    }
    try {
        console.debug('Files submitted', data);
        ctx.forms.files.clearAllErrors();
        if (data?.files && data.files.length > 0) {
            if (data.files instanceof FileList && data.files.length > 0) {
                await (0, api_1.uploadAndSendPhotos)(formId, data.files);
            }
            else if (data.files instanceof File) {
                await (0, api_1.uploadAndSendPhotos)(formId, [data.files]);
            }
            else {
                console.error('Invalid files: ', data.files);
                throw new Error('Unable to upload files!');
            }
        }
        ctx.resetAll();
        success();
    }
    catch (e) {
        console.error('Response error:', e);
        fail(state.messages.internalError);
    }
};
exports.submitFiles = submitFiles;
//# sourceMappingURL=actions.js.map