const $f3423264f852ddfb$export$d16800b7e59a8051 = (selector, parent)=>{
    const el = (parent ?? document).querySelector(selector);
    if (el === null) {
        console.error(`Element not found by selector: ${parent ? "parent" : "document"}.${selector}.`);
        return undefined;
    } else return el;
};
const $f3423264f852ddfb$export$465c18d0577ffcf1 = (selector)=>$f3423264f852ddfb$export$d16800b7e59a8051(selector);
const $f3423264f852ddfb$export$be4e807bcc41c98 = (selector, parent)=>$f3423264f852ddfb$export$d16800b7e59a8051(selector, parent);
const $f3423264f852ddfb$export$52987f4b88db0f2 = (form, handler)=>{
    form.action = "";
    form.method = "";
    form.onsubmit = (e)=>{
        e.preventDefault();
        e.stopPropagation();
    };
    // TODO: Remove all event listeners
    form.addEventListener("submit", handler);
};


class $60c0287b5dcd0fba$var$FormError extends Error {
    parent;
    constructor(message, parent1){
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.parent = parent1;
    }
    toString() {
        return this.message + " Parent: [" + JSON.stringify(parent) + "]";
    }
}
const $60c0287b5dcd0fba$var$scanFormFieldNames = (formElement)=>{
    // TODO: Field selector must be configurable
    const formFieldElements = formElement.querySelectorAll('[data-dm-type="control"]');
    return Array.from(formFieldElements.values()).map((el)=>el.getAttribute("data-dm-name")).filter((name)=>!!name);
};
const $60c0287b5dcd0fba$var$createFormError = (formElement)=>{
    // TODO: Error selector must be configurable
    const element = (0, $f3423264f852ddfb$export$d16800b7e59a8051)('[data-dm-name="form_error"]', formElement);
    if (!element) throw new $60c0287b5dcd0fba$var$FormError("Form error element not found for form", formElement);
    return element;
};
const $60c0287b5dcd0fba$var$createFieldInput = (fieldElement)=>{
    // TODO: Field input selector must be configurable
    const element = (0, $f3423264f852ddfb$export$be4e807bcc41c98)('[data-dm-type="input"]', fieldElement);
    if (!element) throw new $60c0287b5dcd0fba$var$FormError("Form input element not found for: ", fieldElement);
    return element;
};
const $60c0287b5dcd0fba$var$createFieldError = (fieldElement)=>{
    // TODO: Field error selector must be configurable
    const element = (0, $f3423264f852ddfb$export$d16800b7e59a8051)('[data-dm-type="error"]', fieldElement);
    if (!element) throw new $60c0287b5dcd0fba$var$FormError("Form error element not found for: ", fieldElement);
    return element;
};
const $60c0287b5dcd0fba$var$createFieldValidation = (inputElement)=>{
    const required = inputElement.hasAttribute("required");
    const minLength = inputElement.getAttribute("minlength");
    const maxLength = inputElement.getAttribute("maxlength");
    const pattern = inputElement.getAttribute("pattern");
    const min = inputElement.getAttribute("min");
    const max = inputElement.getAttribute("max");
    return (value)=>{
        if (required && !value) return "required";
        if (minLength && String(value).length < Number(minLength)) return "minlength";
        if (maxLength && String(value).length > Number(maxLength)) return "maxlength";
        if (pattern && !new RegExp(pattern).test(String(value))) return "pattern";
        if (min && Number(value) < Number(min)) return "min";
        if (max && Number(value) > Number(max)) return "max";
        return true;
    };
};
const $60c0287b5dcd0fba$var$createFormField = (formElement, name)=>{
    // TODO: Field selector must be configurable
    const fieldElement = (0, $f3423264f852ddfb$export$d16800b7e59a8051)(`[data-dm-name="${name}"]`, formElement);
    if (!fieldElement) throw new $60c0287b5dcd0fba$var$FormError('Form field element not found by name: "' + name, formElement);
    const inputElement = $60c0287b5dcd0fba$var$createFieldInput(fieldElement);
    const errorElement = $60c0287b5dcd0fba$var$createFieldError(fieldElement);
    const validator = $60c0287b5dcd0fba$var$createFieldValidation(inputElement);
    return {
        el: fieldElement,
        input: {
            el: inputElement
        },
        error: {
            el: errorElement
        },
        validator: validator,
        clearError: ()=>errorElement.textContent = "",
        setError: (error)=>errorElement.textContent = error,
        setInputValue: (value)=>inputElement.value = value
    };
};
const $60c0287b5dcd0fba$export$f681a8129d2e9d28 = (selector, formName, formErrorMessages)=>{
    console.debug("Creating form:", formName, selector);
    const formElement = (0, $f3423264f852ddfb$export$465c18d0577ffcf1)(selector);
    if (!formElement) throw new Error("Form element not found by selector: " + selector);
    // TODO: Must be optional!
    const formErrorElement = $60c0287b5dcd0fba$var$createFormError(formElement);
    const fieldNames = $60c0287b5dcd0fba$var$scanFormFieldNames(formElement);
    console.debug("Fields scanned:", fieldNames);
    const fieldElements = fieldNames.map((name)=>$60c0287b5dcd0fba$var$createFormField(formElement, name)).reduce((acc, cur)=>({
            ...acc,
            [cur.input.el.name]: cur
        }), {});
    const getFormValues = ()=>Object.entries(fieldElements).filter(([, instance])=>!!instance && instance.input.el.value.trim().length > 0).map(([name, instance])=>({
                [name]: instance.input.el.value
            })).reduce((acc, cur)=>({
                ...acc,
                ...cur
            }), {});
    const setFormValues = (values)=>{
        Object.entries(values).forEach(([name, value])=>{
            if (fieldElements[name]) fieldElements[name].setInputValue(value);
        });
    };
    const resetForm = ()=>{
        Object.values(fieldElements).forEach((field)=>field.setInputValue(""));
    };
    const setFormDisabled = (disabled)=>{
        Object.values(fieldElements).forEach((field)=>field.input.el.disabled = disabled);
        Array.from(formElement.querySelectorAll('[data-dm-type="button"]')).forEach((element)=>{
            if (element instanceof HTMLButtonElement) element.disabled = disabled;
            // Add "disabled" class to element
            if (disabled) element.classList.add("disabled");
            else element.classList.remove("disabled");
        });
    };
    const setOnSubmit = (handler)=>(0, $f3423264f852ddfb$export$52987f4b88db0f2)(formElement, (e)=>{
            const errors = Object.entries(fieldElements).map(([name, field])=>({
                    [name]: field.validator(field.input.el.value)
                })).reduce((acc, cur)=>({
                    ...acc,
                    ...cur
                }), {});
            const hasErrors = Object.values(errors).some((error)=>error !== true);
            if (hasErrors) {
                console.error("Validation errors", errors);
                Object.entries(errors).forEach(([name, error])=>{
                    if (error !== true) fieldElements[name].setError(formErrorMessages[error]);
                });
            //formErrorElement.textContent = 'Form has errors!'
            } else handler(e);
        });
    // TODO: Avoid this duplication
    Array.from(formElement.querySelectorAll('[data-dm-disable="true"]')).forEach((element)=>{
        if (element instanceof HTMLButtonElement) element.disabled = true;
        element.classList.add("disabled");
    });
    return {
        el: formElement,
        fields: fieldElements,
        error: {
            el: formErrorElement
        },
        clearError: ()=>formErrorElement.textContent = "",
        clearAllErrors: ()=>{
            formErrorElement.textContent = "";
            Object.values(fieldElements).forEach((field)=>field.clearError());
        },
        setError: (error)=>formErrorElement.textContent = error,
        getFormValues: getFormValues,
        setFormValues: setFormValues,
        resetForm: resetForm,
        setFormDisabled: setFormDisabled,
        setOnSubmit: setOnSubmit
    };
};


const $8851cb6643e00dd7$export$dd1bc94b04021eeb = (value)=>value === null || value === undefined;
const $8851cb6643e00dd7$export$96bdbc84526f3739 = (value)=>!$8851cb6643e00dd7$export$dd1bc94b04021eeb(value);


const $1d76aa11c21f6297$export$61ca0380393ac2cc = async (url, init = {
    method: "GET"
})=>{
    const response = await fetch(url, init);
    if (!response.ok) throw new Error(`Failed to fetch ${init.method} ${url}: ${response.status} ${response.statusText}`);
    else {
        const responseText = await response.text();
        if (!responseText || responseText.length === 0) return undefined;
        else return JSON.parse(responseText);
    }
};
const $1d76aa11c21f6297$export$1d2fa8475101ec93 = async (url)=>$1d76aa11c21f6297$export$61ca0380393ac2cc(url);
const $1d76aa11c21f6297$export$e842d00bb3325f27 = async (url, body)=>$1d76aa11c21f6297$export$61ca0380393ac2cc(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    });
const $1d76aa11c21f6297$export$e132348fd6a678a = (url)=>(file)=>{
        const data = new FormData();
        data.append("file", file);
        return $1d76aa11c21f6297$export$61ca0380393ac2cc(url, {
            method: "POST",
            body: data
        });
    };
const $1d76aa11c21f6297$export$bc226234bbb4652f = (files)=>{
    const result = [];
    if ((0, $8851cb6643e00dd7$export$96bdbc84526f3739)(files)) for (const file of files)result.push(file);
    return result;
};
const $1d76aa11c21f6297$export$7b64c937225679ee = (upload, onFileUploadSuccess, onFileUploadError)=>(files)=>Promise.all(files.map((file)=>upload(file).then((result)=>{
                onFileUploadSuccess?.();
                return result;
            }).catch((e)=>{
                // eslint-disable-next-line no-console
                console.error("File upload error", e);
                onFileUploadError?.(e);
                return undefined;
            }))).then((result)=>result.filter((0, $8851cb6643e00dd7$export$96bdbc84526f3739)));
const $1d76aa11c21f6297$export$1ea25e59dc2c9809 = (url, files)=>$1d76aa11c21f6297$export$7b64c937225679ee($1d76aa11c21f6297$export$e132348fd6a678a(url))(files);
const $1d76aa11c21f6297$export$b2fd9029d5529a00 = (url, files)=>$1d76aa11c21f6297$export$1ea25e59dc2c9809(url, $1d76aa11c21f6297$export$bc226234bbb4652f(files));


const $b3a133cf85b0ceb6$var$setupForm = (ctx, formName, formConfig, globalErrorMessages, handlers)=>{
    console.debug("Form:", formName, formConfig);
    const form = (0, $60c0287b5dcd0fba$export$f681a8129d2e9d28)(formConfig.selector, formName, {
        ...globalErrorMessages,
        ...formConfig.errorMessages
    });
    form.setOnSubmit(async ()=>{
        console.log("Form submitted:", formName, form.fields);
        handlers?.beforeSubmit?.(form);
        await formConfig.onSubmit(form.getFormValues(), ctx, ()=>formConfig.onSuccess(ctx), (error)=>formConfig.onError(error, ctx));
        handlers?.afterSubmit?.(form);
    });
    form.el.setAttribute("novalidate", "true");
    return form;
};
const $b3a133cf85b0ceb6$var$defaultErrors = {
    required: "This field is required",
    minlength: "Field length is too small",
    maxlength: "Field length is too big",
    pattern: "Field does not match the pattern",
    min: "Field value is too small",
    max: "Field value is too big"
};
const $b3a133cf85b0ceb6$export$2cd8252107eb640b = (conf)=>{
    console.log("Initializing...", conf);
    const ctx = {
        forms: {}
    };
    if (conf.forms) {
        // TODO: Update foreach to map or reduce
        Object.entries(conf.forms).forEach(([formName, formConfig])=>{
            ctx.forms[formName] = $b3a133cf85b0ceb6$var$setupForm(ctx, formName, formConfig, conf.errorMessages ?? $b3a133cf85b0ceb6$var$defaultErrors, conf.handlers);
        });
        ctx.resetAll = ()=>{
            Object.values(ctx.forms).forEach((form)=>form.resetForm());
        };
        if (conf.buttons) Object.entries(conf.buttons).forEach(([, buttonConfig])=>{
            const button = document.querySelector(buttonConfig.selector);
            if (button) button.addEventListener("click", ()=>buttonConfig.onClick(ctx));
            else console.error("Button not found by selector:", buttonConfig.selector);
        });
        console.log("Initialized with context: ", ctx);
    }
};


export {$b3a133cf85b0ceb6$export$2cd8252107eb640b as init, $1d76aa11c21f6297$export$1d2fa8475101ec93 as apiGet, $1d76aa11c21f6297$export$e842d00bb3325f27 as apiPost, $1d76aa11c21f6297$export$b2fd9029d5529a00 as apiUploadFileList};
//# sourceMappingURL=module.js.map
