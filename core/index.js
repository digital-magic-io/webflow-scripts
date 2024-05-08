"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const form_1 = require("./form");
const dom_1 = require("./dom");
__exportStar(require("./fetch"), exports);
__exportStar(require("./config"), exports);
const setupForm = (ctx, formName, formConfig, globalErrorMessages, handlers) => {
    console.debug('Form:', formName, formConfig);
    const form = (0, form_1.createForm)(formConfig.selector, formName, { ...globalErrorMessages, ...formConfig.errorMessages });
    form.setOnSubmit(async () => {
        console.log('Form submitted:', formName, form.fields);
        handlers?.beforeSubmit?.(form);
        await formConfig.onSubmit(form.getFormValues(), ctx, () => formConfig.onSuccess(ctx), (error) => formConfig.onError(error, ctx));
        handlers?.afterSubmit?.(form);
    });
    form.el.setAttribute('novalidate', 'true');
    return form;
};
const setupButton = (ctx, buttonName, buttonConfig) => {
    const button = (0, dom_1.getElement)(buttonConfig.selector);
    if (button) {
        button.addEventListener('click', () => buttonConfig.onClick(ctx));
        const result = (0, form_1.createButton)(button);
        ctx.buttons[buttonName] = result;
        return result;
    }
    else {
        throw new Error('Button not found by selector: ' + buttonConfig.selector);
    }
};
const setupLabel = (ctx, labelName, labelConfig) => {
    const label = (0, dom_1.getElement)(labelConfig.selector);
    if (label) {
        const result = (0, form_1.createLabel)(label);
        ctx.labels[labelName] = result;
        return result;
    }
    else {
        throw new Error('Label not found by selector: ' + labelConfig.selector);
    }
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
        forms: {},
        buttons: {},
        labels: {}
    };
    if (conf.forms) {
        Object.entries(conf.forms).forEach(([formName, formConfig]) => {
            ctx.forms[formName] = setupForm(ctx, formName, formConfig, conf.errorMessages ?? defaultErrors, conf.handlers);
        });
        ctx.resetAll = () => {
            Object.values(ctx.forms).forEach((form) => form.resetForm());
        };
        if (conf.buttons) {
            Object.entries(conf.buttons).forEach(([buttonName, buttonConfig]) => {
                setupButton(ctx, buttonName, buttonConfig);
            });
        }
        if (conf.labels) {
            Object.entries(conf.labels).forEach(([labelName, labelConfig]) => {
                setupLabel(ctx, labelName, labelConfig);
            });
        }
        console.log('Initialized with context: ', ctx);
    }
};
exports.init = init;
//# sourceMappingURL=index.js.map