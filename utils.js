"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasValue = exports.isEmpty = void 0;
const isEmpty = (value) => value === null || value === undefined;
exports.isEmpty = isEmpty;
const hasValue = (value) => !(0, exports.isEmpty)(value);
exports.hasValue = hasValue;
//# sourceMappingURL=utils.js.map