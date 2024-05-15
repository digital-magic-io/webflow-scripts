"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCp = void 0;
const cp_1 = require("./cp");
const core_1 = require("./core");
const utils_1 = require("./core/utils");
const setVisibilityForAll = (selector, value) => {
    if (selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
            setElementVisible(el, value);
        });
    }
};
const setElementVisible = (el, value) => {
    el.style.display = value ? 'flex' : 'none';
};
const initCp = (conf) => {
    const state = {
        formId: (0, utils_1.createState)(undefined),
        messages: conf.messages,
        captchaKey: conf.captchaKey
    };
    const beforeSubmit = (form) => {
        form.setFormDisabled(true);
        setVisibilityForAll(conf.loaderSelector, true);
    };
    const afterSubmit = (form) => {
        form.setFormDisabled(false);
        setVisibilityForAll(conf.loaderSelector, false);
    };
    const withSubmitAction = async (form, action) => {
        beforeSubmit(form);
        await action().finally(() => afterSubmit(form));
    };
    const labelConfig = {
        markAndModel: {
            selector: conf.labelSelectors.markAndModel
        },
        plateNumber: {
            selector: conf.labelSelectors.plateNumber
        }
    };
    const buttonConfig = {
        updateVehicle: {
            selector: conf.buttonSelectors.updateVehicle,
            onClick: (ctx) => {
                console.debug('Button clicked:', ctx);
                void withSubmitAction(ctx.forms.vehicle, async () => {
                    const plateNumber = ctx.forms.vehicle.fields.plateNumber.input.el.value;
                    await (0, cp_1.reloadVehicleFormData)({
                        data: { plateNumber },
                        ctx,
                        success: () => { },
                        fail: (error) => ctx.forms.vehicle.setError(error),
                        state
                    });
                });
            }
        }
    };
    const initialFormConfig = {
        selector: '[data-dm-id="form_find_vehicle"]',
        onSuccess: (ctx) => {
            conf.actions.switchStep(1, ctx);
        },
        onError: (error, ctx) => {
            ctx.forms.initial.setError(error);
        },
        onSubmit: (data, ctx, success, fail) => (0, cp_1.submitInitialForm)({ data, ctx, success, fail, state })
    };
    const vehicleErrorMessages = {
        pattern: state.messages.invalidEmailError
    };
    const vehicleFormConfig = {
        selector: '[data-dm-id="form_vehicle"]',
        errorMessages: vehicleErrorMessages,
        onSuccess: (ctx) => {
            conf.actions.switchStep(2, ctx);
        },
        onError: (error, ctx) => {
            ctx.forms.vehicle.setError(error);
        },
        onSubmit: (data, ctx, success, fail) => (0, cp_1.submitVehicleForm)({ data, ctx, success, fail, state })
    };
    const filesFormConfig = {
        selector: '[data-dm-id="form_files"]',
        onSuccess: (ctx) => {
            conf.actions.switchStep(3, ctx);
        },
        onError: (error, ctx) => {
            ctx.forms.files.setError(error);
        },
        onSubmit: (data, ctx, success, fail) => (0, cp_1.submitFiles)({ data, ctx, success, fail, state })
    };
    const cfg = {
        forms: {
            initial: initialFormConfig,
            vehicle: vehicleFormConfig,
            files: filesFormConfig
        },
        buttons: buttonConfig,
        labels: labelConfig,
        handlers: { beforeSubmit, afterSubmit },
        errorMessages: conf.errorMessages,
        afterInit: () => {
            setVisibilityForAll(conf.loaderSelector, false);
        }
    };
    (0, core_1.init)(cfg);
};
exports.initCp = initCp;
//# sourceMappingURL=index.js.map