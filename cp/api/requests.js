"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAndSendPhotos = exports.sendPhotos = exports.sendFormData = exports.sendInitForm = exports.lookupCarRegistry = void 0;
const core_1 = require("../../core");
const apiUrl = 'https://test.carprof.ee/api';
const formsUrl = `${apiUrl}/v2/forms`;
const initialFormUrl = `${formsUrl}/initial-data`;
const lookupCarRegistryUrl = (plateNumber) => `${apiUrl}/v1/cars/mnt/${plateNumber}`;
const formDataUrl = (formId) => `${formsUrl}/form-data/${formId}`;
const photosUrl = (formId) => `${formsUrl}/photos/${formId}`;
const fileUrl = `${apiUrl}/v1/forms/file`;
const lookupCarRegistry = async (plateNumber) => (0, core_1.getTyped)(lookupCarRegistryUrl(plateNumber));
exports.lookupCarRegistry = lookupCarRegistry;
const sendInitForm = (request) => (0, core_1.postTyped)(initialFormUrl, request);
exports.sendInitForm = sendInitForm;
const sendFormData = (formId, data) => (0, core_1.postTyped)(formDataUrl(formId), data);
exports.sendFormData = sendFormData;
const sendPhotos = (formId, data) => (0, core_1.postTyped)(photosUrl(formId), data);
exports.sendPhotos = sendPhotos;
const uploadAndSendPhotos = async (formId, files) => {
    if (files instanceof FileList) {
        const fileIds = await (0, core_1.uploadTypedFileList)(fileUrl, files);
        await (0, exports.sendPhotos)(formId, { imageIds: fileIds.map((v) => v.fileId) });
    }
    else if (Array.isArray(files)) {
        const fileIds = await (0, core_1.uploadTypedArray)(fileUrl, files);
        await (0, exports.sendPhotos)(formId, { imageIds: fileIds.map((v) => v.fileId) });
    }
    else {
        console.error('Invalid files: ', files);
        throw new Error('Unable to upload files!');
    }
};
exports.uploadAndSendPhotos = uploadAndSendPhotos;
//# sourceMappingURL=requests.js.map