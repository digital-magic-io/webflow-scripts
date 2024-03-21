"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiGetCar = exports.apiPostBuyout = exports.apiUploadFile = exports.apiPostClient = exports.apiGetClient = void 0;
const fetch_1 = require("./fetch");
const apiUrl = 'https://test.carprof.ee/api/v1';
const formsUrl = `${apiUrl}/forms`;
const externalUrl = `${apiUrl}/external`;
const fileUrl = `${formsUrl}/file`;
const clientUrl = `${externalUrl}/personal-data`;
const buyoutUrl = (formId) => `${externalUrl}/buyout/${formId}`;
const lookupCarRegistryUrl = (plateNumber) => `${apiUrl}/cars/mnt/${plateNumber}`;
const apiGetClient = () => (0, fetch_1.getTyped)(clientUrl);
exports.apiGetClient = apiGetClient;
const apiPostClient = (request) => (0, fetch_1.postTyped)(clientUrl, request);
exports.apiPostClient = apiPostClient;
const apiUploadFile = (file) => (0, fetch_1.uploadTyped)(fileUrl, file);
exports.apiUploadFile = apiUploadFile;
const apiPostBuyout = (formId, request) => (0, fetch_1.postTyped)(buyoutUrl(formId), request);
exports.apiPostBuyout = apiPostBuyout;
const apiGetCar = (plateNumber) => (0, fetch_1.getTyped)(lookupCarRegistryUrl(plateNumber));
exports.apiGetCar = apiGetCar;
//# sourceMappingURL=api.js.map