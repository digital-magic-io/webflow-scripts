"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.apiUploadFileList = exports.apiPost = exports.apiGet = void 0;
const form_1 = require("./form");
var fetch_1 = require("./fetch");
Object.defineProperty(exports, "apiGet", { enumerable: true, get: function () { return fetch_1.getTyped; } });
Object.defineProperty(exports, "apiPost", { enumerable: true, get: function () { return fetch_1.postTyped; } });
Object.defineProperty(exports, "apiUploadFileList", { enumerable: true, get: function () { return fetch_1.uploadTypedFileList; } });
const setupForm = (ctx, formName, formConfig, globalErrorMessages) => {
    console.debug('Form:', formName, formConfig);
    const form = (0, form_1.createForm)(formConfig.selector, formName, { ...globalErrorMessages, ...formConfig.errorMessages });
    form.setOnSubmit(() => {
        console.log('Form submitted:', formName, form.fields);
        formConfig.onSubmit(form.getFormValues(), ctx);
    });
    form.el.setAttribute('novalidate', 'true');
    return form;
};
const defaultErrors = {
    required: 'This field is required',
    minlength: 'Field length is too small',
    maxlength: 'Field length is too big',
    pattern: 'Field does not match the pattern',
    min: 'Field value is too small',
    max: 'Field value is too big'
};
const init = (conf) => {
    console.log('Initializing...', conf);
    const ctx = {
        forms: {}
    };
    if (conf.forms) {
        Object.entries(conf.forms).forEach(([formName, formConfig]) => {
            ctx.forms[formName] = setupForm(ctx, formName, formConfig, conf.errorMessages ?? defaultErrors);
        });
        console.log('Initialized with context: ', ctx);
    }
};
exports.init = init;
//# sourceMappingURL=index.js.map