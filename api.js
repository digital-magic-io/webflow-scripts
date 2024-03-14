"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFilesList = exports.fromFileList = exports.hasValue = exports.isEmpty = exports.apiGetCar = exports.apiPostBuyout = exports.apiUploadFile = exports.apiPostClient = exports.apiGetClient = void 0;
const apiUrl = 'https://test.carprof.ee/api/v1';
const formsUrl = `${apiUrl}/forms`;
const externalUrl = `${apiUrl}/external`;
const fileUrl = `${formsUrl}/file`;
const clientUrl = `${externalUrl}/personal-data`;
const buyoutUrl = (formId) => `${externalUrl}/buyout/${formId}`;
const lookupCarRegistryUrl = (plateNumber) => `${apiUrl}/cars/mnt/${plateNumber}`;
const fetchTyped = async (url, init = { method: 'GET' }) => {
    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${init.method} ${url}: ${response.status} ${response.statusText}`);
    }
    else {
        const responseText = await response.text();
        if (!responseText || responseText.length === 0) {
            return undefined;
        }
        else {
            return JSON.parse(responseText);
        }
    }
};
const getTyped = async (url) => fetchTyped(url);
const postTyped = async (url, body) => fetchTyped(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json'
    }
});
const apiGetClient = () => getTyped(clientUrl);
exports.apiGetClient = apiGetClient;
const apiPostClient = (request) => postTyped(clientUrl, request);
exports.apiPostClient = apiPostClient;
const apiUploadFile = (file) => {
    const data = new FormData();
    data.append('file', file);
    return fetchTyped(fileUrl, {
        method: 'POST',
        body: data
    });
};
exports.apiUploadFile = apiUploadFile;
const apiPostBuyout = (formId, request) => postTyped(buyoutUrl(formId), request);
exports.apiPostBuyout = apiPostBuyout;
const apiGetCar = (plateNumber) => getTyped(lookupCarRegistryUrl(plateNumber));
exports.apiGetCar = apiGetCar;
const isEmpty = (value) => value === null || value === undefined;
exports.isEmpty = isEmpty;
const hasValue = (value) => !(0, exports.isEmpty)(value);
exports.hasValue = hasValue;
const fromFileList = (files) => {
    const result = [];
    if ((0, exports.hasValue)(files)) {
        for (const file of files) {
            result.push(file);
        }
    }
    return result;
};
exports.fromFileList = fromFileList;
const uploadFilesList = (upload, onFileUploadSuccess, onFileUploadError) => (files) => Promise.all(files.map((file) => upload(file)
    .then((result) => {
    onFileUploadSuccess?.();
    return result;
})
    .catch((e) => {
    console.error('File upload error', e);
    onFileUploadError?.(e);
    return undefined;
}))).then((result) => result.filter(exports.hasValue));
exports.uploadFilesList = uploadFilesList;
//# sourceMappingURL=api.js.map