"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.validateNonEmpty = exports.validateInput = exports.isEmpty = void 0;
const isEmpty = (value) => value === null || value === undefined;
exports.isEmpty = isEmpty;
const validateInput = (field, validator, errMsg) => {
    const value = field.input.el.value;
    if (!value) {
        console.error('Form field has no input!', field.name, field.el);
        return undefined;
    }
    if (!validator(value)) {
        field.setError(errMsg());
        return undefined;
    }
    return value;
};
exports.validateInput = validateInput;
const validateNonEmpty = (field) => (0, exports.validateInput)(field, (value) => value.length > 0, () => 'This field must be filled!');
exports.validateNonEmpty = validateNonEmpty;
const validateEmail = (field) => (0, exports.validateInput)(field, (value) => value.includes('@'), () => 'Invalid email!');
exports.validateEmail = validateEmail;
//# sourceMappingURL=validators.js.map