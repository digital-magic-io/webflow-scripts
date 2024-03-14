"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForm = exports.setupFormHandler = exports.getElementById = void 0;
const dmtypes_1 = require("./dmtypes");
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
const createDmElement = (el, name = undefined) => {
    return {
        el,
        id: el.attributes.getNamedItem('data-dm-id')?.value,
        name: name ?? el.attributes.getNamedItem('data-dm-name')?.value,
        type: el.attributes.getNamedItem('data-dm-type')?.value,
        show: () => {
            el.style.display = 'block';
        },
        hide: () => {
            el.style.display = 'none';
        }
    };
};
const createDmElementOpt = (el, name = undefined) => (el ? createDmElement(el, name) : undefined);
const getElementById = (id) => getElement(`[data-dm-id="${id}"]`);
exports.getElementById = getElementById;
const getElementChildByType = (name, type) => getElement(`[data-dm-name="${name}"][data-dm-type="${type}"]`);
const getElementChildByName = (id, name) => getElement(`[data-dm-id="${id}"][data-dm-name="${name}"]`);
const getField = (name) => {
    const field = getElement(`[data-dm-name="${name}"]`);
    const getErrorEl = () => getElementChildByType(name, 'error');
    const setState = (state) => {
        const el = getErrorEl();
        if (el) {
            el.classList.remove(dmtypes_1.DmFieldStateList.map((s) => `field-state-${s}`).join(' '));
            el.classList.add(`field-state-${state}`);
        }
    };
    if (field) {
        return {
            ...createDmElement(field, name),
            getLabel: () => createDmElementOpt(getElementChildByType(name, 'label')),
            getInput: () => createDmElementOpt(getElementChildByType(name, 'input')),
            setInputValue: (value) => {
                getElementChildByType(name, 'input')?.setAttribute('value', value);
            },
            getError: () => createDmElementOpt(getErrorEl()),
            setState: setState,
            clearError() {
                const el = getErrorEl();
                if (el) {
                    setState('default');
                    el.innerHTML = '';
                }
            },
            setError: (error) => {
                const el = getErrorEl();
                if (el) {
                    setState('error');
                    el.innerHTML = error;
                }
            }
        };
    }
    else {
        return undefined;
    }
};
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
const getForm = (name) => {
    const form = getElement(`[data-dm-id="${name}"]`);
    const getErrorEl = () => getElementChildByName(name, 'form_error');
    if (form) {
        return {
            name: name,
            el: form,
            show: () => {
                form.style.display = 'block';
            },
            hide: () => {
                form.style.display = 'none';
            },
            getField: getField,
            getError: () => createDmElementOpt(getErrorEl()),
            clearError() {
                const el = getErrorEl();
                if (el) {
                    el.innerHTML = '';
                }
            },
            setError: (error) => {
                const el = getErrorEl();
                if (el) {
                    el.innerHTML = error;
                }
            },
            setOnSubmit: (handler) => (0, exports.setupFormHandler)(form, handler)
        };
    }
    else {
        return undefined;
    }
};
exports.getForm = getForm;
//# sourceMappingURL=dmdom.js.map