"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showElement = exports.setupBtnHandler = exports.setupFormHandler = exports.setMsg = exports.getForm = exports.setInput = exports.getInput = exports.getElement = void 0;
const getElement = (path) => {
    const el = document.querySelector(path);
    if (el === null) {
        console.error(`Element not found by path: ${path}.`);
        return undefined;
    }
    else {
        return el;
    }
};
exports.getElement = getElement;
const getInput = (path) => (0, exports.getElement)(path);
exports.getInput = getInput;
const setInput = (path, value) => {
    const input = (0, exports.getInput)(path);
    if (input) {
        input.value = value;
    }
};
exports.setInput = setInput;
const getForm = (path) => (0, exports.getElement)(path);
exports.getForm = getForm;
const setMsg = (path, msg) => {
    const el = (0, exports.getElement)(path);
    if (el) {
        el.innerHTML = msg;
    }
};
exports.setMsg = setMsg;
const setupFormHandler = (path, handler) => {
    const form = (0, exports.getForm)(path);
    if (form) {
        form.action = '';
        form.method = '';
        form.onsubmit = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        form.addEventListener('submit', handler);
    }
    else {
        console.error(`Unable to find form with id "${path}"`);
    }
};
exports.setupFormHandler = setupFormHandler;
const setupBtnHandler = (path, handler) => {
    const btn = (0, exports.getElement)(path);
    if (btn) {
        btn.onclick = handler;
    }
    else {
        console.error(`Unable to find button with id "${path}"`);
    }
};
exports.setupBtnHandler = setupBtnHandler;
const showElement = (path) => {
    const el = (0, exports.getElement)(path);
    if (el) {
        el.style.display = 'block';
    }
};
exports.showElement = showElement;
//# sourceMappingURL=wfdom.js.map