"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createForm = void 0;
const dom_1 = require("./dom");
class FormError extends Error {
    parent;
    constructor(message, parent) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.parent = parent;
    }
    toString() {
        return this.message + ' Parent: [' + JSON.stringify(parent) + ']';
    }
}
const scanFormFieldNames = (formElement) => {
    const formFieldElements = formElement.querySelectorAll('[data-dm-type="control"]');
    return Array.from(formFieldElements.values())
        .map((el) => el.getAttribute('data-dm-name'))
        .filter((name) => !!name);
};
const createFormError = (formElement) => {
    const element = (0, dom_1.getElement)('[data-dm-name="form_error"]', formElement);
    if (!element) {
        throw new FormError('Form error element not found for form', formElement);
    }
    return element;
};
const createFieldInput = (fieldElement) => {
    const element = (0, dom_1.getInputElement)('[data-dm-type="input"]', fieldElement);
    if (!element) {
        throw new FormError('Form input element not found for: ', fieldElement);
    }
    return element;
};
const createFieldError = (fieldElement) => {
    const element = (0, dom_1.getElement)('[data-dm-type="error"]', fieldElement);
    if (!element) {
        throw new FormError('Form error element not found for: ', fieldElement);
    }
    return element;
};
const createFieldValidation = (inputElement) => {
    const required = inputElement.hasAttribute('required');
    const minLength = inputElement.getAttribute('minlength');
    const maxLength = inputElement.getAttribute('maxlength');
    const pattern = inputElement.getAttribute('pattern');
    const min = inputElement.getAttribute('min');
    const max = inputElement.getAttribute('max');
    return (value) => {
        if (required && !value) {
            return 'required';
        }
        if (minLength && String(value).length < Number(minLength)) {
            return 'minlength';
        }
        if (maxLength && String(value).length > Number(maxLength)) {
            return 'maxlength';
        }
        if (pattern && !new RegExp(pattern).test(String(value))) {
            return 'pattern';
        }
        if (min && Number(value) < Number(min)) {
            return 'min';
        }
        if (max && Number(value) > Number(max)) {
            return 'max';
        }
        return true;
    };
};
const createFormField = (formElement, name) => {
    const fieldElement = (0, dom_1.getElement)(`[data-dm-name="${name}"]`, formElement);
    if (!fieldElement) {
        throw new FormError('Form field element not found by name: "' + name, formElement);
    }
    const inputElement = createFieldInput(fieldElement);
    const errorElement = createFieldError(fieldElement);
    const validator = createFieldValidation(inputElement);
    return {
        el: fieldElement,
        input: { el: inputElement },
        error: { el: errorElement },
        validator: validator,
        clearError: () => (errorElement.textContent = ''),
        setError: (error) => (errorElement.textContent = error),
        setInputValue: (value) => (inputElement.value = value)
    };
};
const createForm = (selector, formName, formErrorMessages) => {
    console.debug('Creating form:', formName, selector);
    const formElement = (0, dom_1.getFormElement)(selector);
    if (!formElement) {
        throw new Error('Form element not found by selector: ' + selector);
    }
    const formErrorElement = createFormError(formElement);
    const fieldNames = scanFormFieldNames(formElement);
    console.debug('Fields scanned:', fieldNames);
    const fieldElements = fieldNames
        .map((name) => createFormField(formElement, name))
        .reduce((acc, cur) => ({ ...acc, [cur.input.el.name]: cur }), {});
    const getFormValues = () => Object.entries(fieldElements)
        .map(([name, instance]) => ({ [name]: instance.input.el.value }))
        .filter((rec) => !!rec[1] && rec[1].length > 0)
        .reduce((acc, cur) => ({ ...acc, ...cur }), {});
    const setFormValues = (values) => {
        Object.entries(values).forEach(([name, value]) => {
            if (fieldElements[name]) {
                fieldElements[name].setInputValue(value);
            }
        });
    };
    const setOnSubmit = (handler) => (0, dom_1.setupFormHandler)(formElement, (e) => {
        const errors = Object.entries(fieldElements)
            .map(([name, field]) => ({ [name]: field.validator(field.input.el.value) }))
            .reduce((acc, cur) => ({ ...acc, ...cur }), {});
        console.error('Validation errors', errors);
        const hasErrors = Object.values(errors).some((error) => error !== true);
        if (hasErrors) {
            Object.entries(errors).forEach(([name, error]) => {
                if (error !== true) {
                    fieldElements[name].setError(formErrorMessages[error]);
                }
            });
        }
        else {
            handler(e);
        }
    });
    return {
        el: formElement,
        fields: fieldElements,
        error: { el: formErrorElement },
        clearError: () => (formErrorElement.textContent = ''),
        clearAllErrors: () => {
            formErrorElement.textContent = '';
            Object.values(fieldElements).forEach((field) => field.clearError());
        },
        setError: (error) => (formErrorElement.textContent = error),
        getFormValues,
        setFormValues,
        setOnSubmit
    };
};
exports.createForm = createForm;
//# sourceMappingURL=form.js.map