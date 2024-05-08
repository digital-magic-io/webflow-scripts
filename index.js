"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCp = void 0;
const cp_1 = require("./cp");
const core_1 = require("./core");
const initCp = (conf) => {
    console.log('Initializing...', conf);
    let formId = undefined;
    const setFormId = (id) => {
        formId = id;
    };
    const labelConfig = {
        testLabel: {
            selector: '[data-dm-id="testLabel"]'
        }
    };
    const buttonConfig = {
        manual: {
            selector: '[data-dm-id="manual"]',
            onClick: (ctx) => {
                console.debug('Button clicked:', ctx);
                ctx.buttons.manual.setDisabled(true);
                ctx.buttons.manual.setLabel('Loading...');
                ctx.labels.testLabel.setLabel('Test label');
                setTimeout(() => {
                    ctx.forms.initial.el.style.display = 'none';
                    ctx.forms.vehicle.el.removeAttribute('style');
                }, 3000);
            }
        }
    };
    const initialFormConfig = {
        selector: '[data-dm-id="form_find_vehicle"]',
        onSuccess: (ctx) => {
            console.log('Next step');
            ctx.forms.initial.el.style.display = 'none';
            ctx.forms.vehicle.el.removeAttribute('style');
        },
        onError: (error, ctx) => {
            ctx.forms.initial.setError(error);
        },
        onSubmit: (data, ctx, success, fail) => (0, cp_1.submitInitialForm)({ data, ctx, success, fail, setFormId, formId })
    };
    const vehicleErrorMessages = {
        pattern: 'Email is not valid'
    };
    const vehicleFormConfig = {
        selector: '[data-dm-id="form_vehicle"]',
        errorMessages: vehicleErrorMessages,
        onSuccess: (ctx) => {
            console.log('Next step');
            ctx.forms.vehicle.el.style.display = 'none';
            ctx.forms.files.el.removeAttribute('style');
        },
        onError: (error, ctx) => {
            ctx.forms.vehicle.setError(error);
        },
        onSubmit: (data, ctx, success, fail) => (0, cp_1.submitVehicleForm)({ data, ctx, success, fail, setFormId, formId })
    };
    const filesFormConfig = {
        selector: '[data-dm-id="form_files"]',
        onSuccess: (ctx) => {
            ctx.forms.files.el.style.display = 'none';
            document.getElementById('success_step')?.removeAttribute('style');
            console.log('Great Success!');
        },
        onError: (error, ctx) => {
            ctx.forms.files.setError(error);
        },
        onSubmit: (data, ctx, success, fail) => (0, cp_1.submitFiles)({ data, ctx, success, fail, setFormId, formId })
    };
    const cfg = {
        forms: {
            initial: initialFormConfig,
            vehicle: vehicleFormConfig,
            files: filesFormConfig
        },
        buttons: buttonConfig,
        labels: labelConfig,
        handlers: conf.handlers,
        errorMessages: conf.errorMessages
    };
    (0, core_1.init)(cfg);
};
exports.initCp = initCp;
//# sourceMappingURL=index.js.map