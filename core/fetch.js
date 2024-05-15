"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTypedFileList = exports.uploadTypedArray = exports.uploadFilesList = exports.fromFileList = exports.uploadTyped = exports.postTyped = exports.getTyped = exports.fetchTyped = exports.getErrorFromResponse = exports.ApiError = void 0;
const utils_1 = require("./utils");
class ApiError extends Error {
    status;
    url;
    method;
    cause;
    response;
    constructor(response, cause) {
        super(`Failed to fetch ${response.url}: ${response.status} ${response.statusText}: ${cause}`);
        this.status = response.status;
        this.url = response.url;
        this.method = response.statusText;
        this.cause = cause;
        this.response = response;
    }
}
exports.ApiError = ApiError;
const getErrorFromResponse = async (response) => {
    const responseText = await response.text();
    if (!responseText || responseText.length === 0) {
        return undefined;
    }
    else {
        return JSON.parse(responseText);
    }
};
exports.getErrorFromResponse = getErrorFromResponse;
const fetchTyped = async (url, init = { method: 'GET' }) => {
    const response = await fetch(url, init);
    if (!response.ok) {
        throw new ApiError(response, 'Unsuccessful HTTP status');
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
exports.fetchTyped = fetchTyped;
const getTyped = async (url) => (0, exports.fetchTyped)(url);
exports.getTyped = getTyped;
const postTyped = async (url, body) => (0, exports.fetchTyped)(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
        'Content-Type': 'application/json'
    }
});
exports.postTyped = postTyped;
const uploadTyped = (url) => (file) => {
    const data = new FormData();
    data.append('file', file);
    return (0, exports.fetchTyped)(url, {
        method: 'POST',
        body: data
    });
};
exports.uploadTyped = uploadTyped;
const fromFileList = (files) => {
    const result = [];
    if ((0, utils_1.hasValue)(files)) {
        for (const file of files) {
            result.push(file);
        }
    }
    return result;
};
exports.fromFileList = fromFileList;
const uploadFilesList = (upload, onFileUploadSuccess, onFileUploadError) => (files) => {
    console.log('uploadFilesList', files);
    return Promise.all(files.map((file) => upload(file)
        .then((result) => {
        onFileUploadSuccess?.();
        return result;
    })
        .catch((e) => {
        console.error('File upload error', e);
        onFileUploadError?.(e);
        throw e;
    }))).then((result) => result.filter(utils_1.hasValue));
};
exports.uploadFilesList = uploadFilesList;
const uploadTypedArray = (url, files) => (0, exports.uploadFilesList)((0, exports.uploadTyped)(url))(files);
exports.uploadTypedArray = uploadTypedArray;
const uploadTypedFileList = (url, files) => (0, exports.uploadTypedArray)(url, (0, exports.fromFileList)(files));
exports.uploadTypedFileList = uploadTypedFileList;
//# sourceMappingURL=fetch.js.map