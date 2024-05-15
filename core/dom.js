"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupFormHandler = exports.getInputElement = exports.getFormElement = exports.getElement = void 0;
const getElement = (selector, parent) => {
    const el = (parent ?? document).querySelector(selector);
    if (el === null) {
        console.error(`Element not found by selector: ${parent ? 'parent' : 'document'}.${selector}.`);
        return undefined;
    }
    else {
        return el;
    }
};
exports.getElement = getElement;
const getFormElement = (selector) => (0, exports.getElement)(selector);
exports.getFormElement = getFormElement;
const getInputElement = (selector, parent) => (0, exports.getElement)(selector, parent);
exports.getInputElement = getInputElement;
const setupFormHandler = (form, handler) => {
    form.action = '';
    form.method = '';
    form.onsubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    form.addEventListener('submit', handler);
};
exports.setupFormHandler = setupFormHandler;
//# sourceMappingURL=dom.js.map