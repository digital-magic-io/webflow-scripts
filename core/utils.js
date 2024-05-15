"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createState = exports.mapOrElse = exports.getOrElse = exports.mapValue = exports.hasValue = exports.isEmpty = void 0;
const isEmpty = (value) => value === null || value === undefined;
exports.isEmpty = isEmpty;
const hasValue = (value) => !(0, exports.isEmpty)(value);
exports.hasValue = hasValue;
const mapValue = (value, f) => (0, exports.hasValue)(value) ? f(value) : undefined;
exports.mapValue = mapValue;
const getOrElse = (value, defaultValue) => ((0, exports.hasValue)(value) ? value : defaultValue);
exports.getOrElse = getOrElse;
const mapOrElse = (value, f, defaultValue) => (0, exports.hasValue)(value) ? f(value) : defaultValue;
exports.mapOrElse = mapOrElse;
const createState = (initialState) => {
    let state = initialState;
    return {
        set: (newState) => {
            state = newState;
        },
        get: () => state
    };
};
exports.createState = createState;
//# sourceMappingURL=utils.js.map