"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormInstance = void 0;
const getFormFields = (form, fieldNames) => {
    const fields = fieldNames.map((name) => form.getField(name));
    if (fields.length !== fieldNames.length) {
        console.error('Form should have all fields!', fieldNames);
        form.setError('Unexpected error: missing fields!');
        return undefined;
    }
    else {
        return fields;
    }
};
const createRecord = (arr, propertyName) => {
    const record = {};
    arr.forEach((item) => {
        const key = item[propertyName];
        record[key] = item;
    });
    return record;
};
const createFormInstance = (form, fieldNames) => {
    const fields = getFormFields(form, fieldNames);
    if (!fields) {
        throw new Error('Form should have all fields!');
    }
    const fieldInstances = fields.map((field) => {
        const label = field.getLabel();
        const input = field.getInput();
        const error = field.getError();
        if (!label || !input || !error) {
            console.error('Form field must have label, input, error elements!', field.name, field.el);
            throw new Error('Form field must have label, input, error elements!');
        }
        return {
            label,
            input,
            error,
            id: field.id,
            name: field.name,
            type: field.type,
            el: field.el,
            show: () => field.show(),
            hide: () => field.hide(),
            clearError: () => field.clearError(),
            setError: (error) => field.setError(error),
            setState: (state) => field.setState(state),
            setInputValue: (value) => field.setInputValue(value)
        };
    });
    const error = form.getError();
    if (!error) {
        console.error('Form must have error element!', form.el);
        throw new Error('Form must have error element!');
    }
    return {
        id: form.id,
        name: form.name,
        type: form.type,
        el: form.el,
        show: () => form.show(),
        hide: () => form.hide(),
        fields: createRecord(fieldInstances, 'name'),
        error: error,
        clearError: () => form.clearError(),
        clearAllErrors: () => {
            form.clearError();
            fieldInstances.forEach((field) => field.clearError());
        },
        setError: (error) => form.setError(error),
        setOnSubmit: (handler) => form.setOnSubmit(handler)
    };
};
exports.createFormInstance = createFormInstance;
//# sourceMappingURL=dmform.js.map