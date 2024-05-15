
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "initCp", function () { return $15451612c40a4a0c$export$cd874e48ff214f68; });
const $68d6acfa1617944c$export$d16800b7e59a8051 = (selector, parent)=>{
    const el = (parent ?? document).querySelector(selector);
    if (el === null) {
        // eslint-disable-next-line no-console
        console.error(`Element not found by selector: ${parent ? "parent" : "document"}.${selector}.`);
        return undefined;
    } else return el;
};
const $68d6acfa1617944c$export$465c18d0577ffcf1 = (selector)=>$68d6acfa1617944c$export$d16800b7e59a8051(selector);
const $68d6acfa1617944c$export$be4e807bcc41c98 = (selector, parent)=>$68d6acfa1617944c$export$d16800b7e59a8051(selector, parent);
const $68d6acfa1617944c$export$52987f4b88db0f2 = (form, handler)=>{
    form.action = "";
    form.method = "";
    form.onsubmit = (e)=>{
        e.preventDefault();
        e.stopPropagation();
    };
    // TODO: Remove all event listeners
    form.addEventListener("submit", handler);
};


class $7b19bfce950638d7$var$FormError extends Error {
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
const $7b19bfce950638d7$var$scanFormFieldNames = (formElement)=>{
    // TODO: Field selector must be configurable
    const formFieldElements = formElement.querySelectorAll('[data-dm-type="control"]');
    return Array.from(formFieldElements.values()).map((el)=>el.getAttribute("data-dm-name")).filter((name)=>!!name);
};
const $7b19bfce950638d7$var$createFormError = (formElement)=>{
    // TODO: Error selector must be configurable
    const element = (0, $68d6acfa1617944c$export$d16800b7e59a8051)('[data-dm-name="form_error"]', formElement);
    if (!element) throw new $7b19bfce950638d7$var$FormError("Form error element not found for form", formElement);
    return element;
};
const $7b19bfce950638d7$var$createFieldInput = (fieldElement)=>{
    // TODO: Field input selector must be configurable
    const element = (0, $68d6acfa1617944c$export$be4e807bcc41c98)('[data-dm-type="input"]', fieldElement);
    if (!element) throw new $7b19bfce950638d7$var$FormError("Form input element not found for: ", fieldElement);
    return element;
};
const $7b19bfce950638d7$var$createFieldError = (fieldElement)=>{
    // TODO: Field error selector must be configurable
    const element = (0, $68d6acfa1617944c$export$d16800b7e59a8051)('[data-dm-type="error"]', fieldElement);
    if (!element) throw new $7b19bfce950638d7$var$FormError("Form error element not found for: ", fieldElement);
    return element;
};
const $7b19bfce950638d7$var$createFieldValidation = (inputElement)=>{
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
const $7b19bfce950638d7$var$createFormField = (formElement, name)=>{
    // TODO: Field selector must be configurable
    const fieldElement = (0, $68d6acfa1617944c$export$d16800b7e59a8051)(`[data-dm-name="${name}"]`, formElement);
    if (!fieldElement) throw new $7b19bfce950638d7$var$FormError('Form field element not found by name: "' + name, formElement);
    const inputElement = $7b19bfce950638d7$var$createFieldInput(fieldElement);
    const errorElement = $7b19bfce950638d7$var$createFieldError(fieldElement);
    const validator = $7b19bfce950638d7$var$createFieldValidation(inputElement);
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
const $7b19bfce950638d7$export$f681a8129d2e9d28 = (selector, formName, formErrorMessages)=>{
    console.debug("Creating form:", formName, selector);
    const formElement = (0, $68d6acfa1617944c$export$465c18d0577ffcf1)(selector);
    if (!formElement) throw new Error("Form element not found by selector: " + selector);
    // TODO: Must be optional!
    const formErrorElement = $7b19bfce950638d7$var$createFormError(formElement);
    const fieldNames = $7b19bfce950638d7$var$scanFormFieldNames(formElement);
    //console.debug('Fields scanned:', fieldNames)
    const fieldElements = fieldNames.map((name)=>$7b19bfce950638d7$var$createFormField(formElement, name)).reduce((acc, cur)=>({
            ...acc,
            [cur.input.el.name]: cur
        }), {});
    const getFormValues = ()=>Object.entries(fieldElements).filter(([, instance])=>!!instance && (instance.input.el.type !== "file" && instance.input.el.value.trim().length > 0 || instance.input.el.type === "file")).map(([name, instance])=>({
                [name]: instance.input.el.type === "file" ? instance.input.el.files : instance.input.el.value
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
            // Add "disabled" class to an element
            if (disabled) element.classList.add("disabled");
            else element.classList.remove("disabled");
        });
    };
    const setOnSubmit = (handler)=>(0, $68d6acfa1617944c$export$52987f4b88db0f2)(formElement, (e)=>{
            const errors = Object.entries(fieldElements).map(([name, field])=>({
                    [name]: field.validator(field.input.el.value)
                })).reduce((acc, cur)=>({
                    ...acc,
                    ...cur
                }), {});
            const hasErrors = Object.values(errors).some((error)=>error !== true);
            if (hasErrors) {
                // eslint-disable-next-line no-console
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
const $7b19bfce950638d7$export$9b6d6ca62970729f = (buttonElement)=>({
        el: buttonElement,
        setLabel: (label)=>buttonElement.textContent = label,
        setDisabled: (disabled)=>buttonElement.disabled = disabled
    });
const $7b19bfce950638d7$export$f2839682b8c07f35 = (labelElement)=>({
        el: labelElement,
        setLabel: (label)=>labelElement.textContent = label
    });



const $7546c35f5f2b619a$export$dd1bc94b04021eeb = (value)=>value === null || value === undefined;
const $7546c35f5f2b619a$export$96bdbc84526f3739 = (value)=>!$7546c35f5f2b619a$export$dd1bc94b04021eeb(value);
const $7546c35f5f2b619a$export$4f84e3a82c7b538 = (value, f)=>$7546c35f5f2b619a$export$96bdbc84526f3739(value) ? f(value) : undefined;
const $7546c35f5f2b619a$export$8832081647a02ee7 = (value, defaultValue)=>$7546c35f5f2b619a$export$96bdbc84526f3739(value) ? value : defaultValue;
const $7546c35f5f2b619a$export$ec46e854364465e6 = (value, f, defaultValue)=>$7546c35f5f2b619a$export$96bdbc84526f3739(value) ? f(value) : defaultValue;
const $7546c35f5f2b619a$export$e6a0daad8304de = (initialState)=>{
    let state = initialState;
    return {
        set: (newState)=>{
            state = newState;
        },
        get: ()=>state
    };
};


class $f20d18f353317b2a$export$f2e832acab1bdd79 extends Error {
    status;
    url;
    method;
    cause;
    response;
    constructor(response, cause){
        super(`Failed to fetch ${response.url}: ${response.status} ${response.statusText}: ${cause}`);
        this.status = response.status;
        this.url = response.url;
        this.method = response.statusText;
        this.cause = cause;
        this.response = response;
    }
}
const $f20d18f353317b2a$export$7780d7826aafbede = async (response)=>{
    const responseText = await response.text();
    if (!responseText || responseText.length === 0) return undefined;
    else return JSON.parse(responseText);
};
const $f20d18f353317b2a$export$61ca0380393ac2cc = async (url, init = {
    method: "GET"
})=>{
    const response = await fetch(url, init);
    if (!response.ok) throw new $f20d18f353317b2a$export$f2e832acab1bdd79(response, "Unsuccessful HTTP status");
    else {
        const responseText = await response.text();
        if (!responseText || responseText.length === 0) return undefined;
        else return JSON.parse(responseText);
    }
};
const $f20d18f353317b2a$export$1d2fa8475101ec93 = async (url)=>$f20d18f353317b2a$export$61ca0380393ac2cc(url);
const $f20d18f353317b2a$export$e842d00bb3325f27 = async (url, body)=>$f20d18f353317b2a$export$61ca0380393ac2cc(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    });
const $f20d18f353317b2a$export$e132348fd6a678a = (url)=>(file)=>{
        const data = new FormData();
        data.append("file", file);
        return $f20d18f353317b2a$export$61ca0380393ac2cc(url, {
            method: "POST",
            body: data
        });
    };
const $f20d18f353317b2a$export$bc226234bbb4652f = (files)=>{
    const result = [];
    if ((0, $7546c35f5f2b619a$export$96bdbc84526f3739)(files)) for (const file of files)result.push(file);
    return result;
};
const $f20d18f353317b2a$export$7b64c937225679ee = (upload, onFileUploadSuccess, onFileUploadError)=>(files)=>Promise.all(files.map((file)=>upload(file).then((result)=>{
                onFileUploadSuccess?.();
                return result;
            }).catch((e)=>{
                // eslint-disable-next-line no-console
                console.error("File upload error", e);
                onFileUploadError?.(e);
                throw e;
            }))).then((result)=>result.filter((0, $7546c35f5f2b619a$export$96bdbc84526f3739)));
const $f20d18f353317b2a$export$1ea25e59dc2c9809 = (url, files)=>$f20d18f353317b2a$export$7b64c937225679ee($f20d18f353317b2a$export$e132348fd6a678a(url))(files);
const $f20d18f353317b2a$export$b2fd9029d5529a00 = (url, files)=>$f20d18f353317b2a$export$1ea25e59dc2c9809(url, $f20d18f353317b2a$export$bc226234bbb4652f(files));




const $0564b07561875788$var$setupForm = (ctx, formName, formConfig, globalErrorMessages, handlers)=>{
    //console.debug('Form:', formName, formConfig)
    const form = (0, $7b19bfce950638d7$export$f681a8129d2e9d28)(formConfig.selector, formName, {
        ...globalErrorMessages,
        ...formConfig.errorMessages
    });
    handlers?.init?.(form);
    form.setOnSubmit(async ()=>{
        handlers?.beforeSubmit?.(form);
        await formConfig.onSubmit(form.getFormValues(), ctx, ()=>formConfig.onSuccess(ctx), (error)=>formConfig.onError(error, ctx)).catch((error)=>{
            // eslint-disable-next-line no-console
            console.error("Unhandled exception!", error);
            formConfig.onError("Unexpected error!", ctx);
        }).finally(()=>{
            handlers?.afterSubmit?.(form);
        });
    });
    form.el.setAttribute("novalidate", "true");
    return form;
};
const $0564b07561875788$var$setupButton = (ctx, buttonName, buttonConfig)=>{
    const button = (0, $68d6acfa1617944c$export$d16800b7e59a8051)(buttonConfig.selector);
    if (button) {
        button.addEventListener("click", ()=>buttonConfig.onClick(ctx));
        const result = (0, $7b19bfce950638d7$export$9b6d6ca62970729f)(button);
        ctx.buttons[buttonName] = result;
        return result;
    } else throw new Error("Button not found by selector: " + buttonConfig.selector);
};
const $0564b07561875788$var$setupLabel = (ctx, labelName, labelConfig)=>{
    const label = (0, $68d6acfa1617944c$export$d16800b7e59a8051)(labelConfig.selector);
    if (label) {
        const result = (0, $7b19bfce950638d7$export$f2839682b8c07f35)(label);
        ctx.labels[labelName] = result;
        return result;
    } else throw new Error("Label not found by selector: " + labelConfig.selector);
};
const $0564b07561875788$var$defaultErrors = {
    required: "This field is required",
    minlength: "Field length is too small",
    maxlength: "Field length is too big",
    pattern: "Field does not match the pattern",
    min: "Field value is too small",
    max: "Field value is too big"
};
const $0564b07561875788$export$2cd8252107eb640b = (conf)=>{
    const ctx = {
        forms: {},
        buttons: {},
        labels: {}
    };
    if (conf.forms) {
        // TODO: Update foreach to map or reduce
        Object.entries(conf.forms).forEach(([formName, formConfig])=>{
            ctx.forms[formName] = $0564b07561875788$var$setupForm(ctx, formName, formConfig, conf.errorMessages ?? $0564b07561875788$var$defaultErrors, conf.handlers);
        });
        ctx.resetAll = ()=>{
            Object.values(ctx.forms).forEach((form)=>form.resetForm());
        };
        if (conf.buttons) Object.entries(conf.buttons).forEach(([buttonName, buttonConfig])=>{
            $0564b07561875788$var$setupButton(ctx, buttonName, buttonConfig);
        });
        if (conf.labels) Object.entries(conf.labels).forEach(([labelName, labelConfig])=>{
            $0564b07561875788$var$setupLabel(ctx, labelName, labelConfig);
        });
        conf.afterInit?.(ctx);
    }
};


const $9875fc359f01f731$var$apiUrl = "https://test.carprof.ee/api";
// const apiUrl = 'https://carprof.ee/api'
const $9875fc359f01f731$var$formsUrl = `${$9875fc359f01f731$var$apiUrl}/v2/forms`;
const $9875fc359f01f731$var$initialFormUrl = `${$9875fc359f01f731$var$formsUrl}/initial-data`;
const $9875fc359f01f731$var$lookupCarRegistryUrl = (plateNumber)=>`${$9875fc359f01f731$var$apiUrl}/v1/cars/mnt/${plateNumber}`;
const $9875fc359f01f731$var$formDataUrl = (formId)=>`${$9875fc359f01f731$var$formsUrl}/form-data/${formId}`;
const $9875fc359f01f731$var$photosUrl = (formId)=>`${$9875fc359f01f731$var$formsUrl}/photos/${formId}`;
const $9875fc359f01f731$var$fileUrl = `${$9875fc359f01f731$var$apiUrl}/v1/forms/file`;
const $9875fc359f01f731$export$8bdb25a87ae6a6fa = async (plateNumber)=>(0, $f20d18f353317b2a$export$1d2fa8475101ec93)($9875fc359f01f731$var$lookupCarRegistryUrl(plateNumber));
const $9875fc359f01f731$export$a6b4d7d396320855 = (request)=>(0, $f20d18f353317b2a$export$e842d00bb3325f27)($9875fc359f01f731$var$initialFormUrl, request);
const $9875fc359f01f731$export$e7cdd9ab52da88de = (formId, data)=>(0, $f20d18f353317b2a$export$e842d00bb3325f27)($9875fc359f01f731$var$formDataUrl(formId), data);
const $9875fc359f01f731$export$d1e050cff6279152 = (formId, data)=>(0, $f20d18f353317b2a$export$e842d00bb3325f27)($9875fc359f01f731$var$photosUrl(formId), data);
const $9875fc359f01f731$export$42404212ef451a92 = async (formId, files)=>{
    if (files instanceof FileList) {
        const fileIds = await (0, $f20d18f353317b2a$export$b2fd9029d5529a00)($9875fc359f01f731$var$fileUrl, files);
        await $9875fc359f01f731$export$d1e050cff6279152(formId, {
            imageIds: fileIds.map((v)=>v.fileId)
        });
    } else if (Array.isArray(files)) {
        const fileIds = await (0, $f20d18f353317b2a$export$1ea25e59dc2c9809)($9875fc359f01f731$var$fileUrl, files);
        await $9875fc359f01f731$export$d1e050cff6279152(formId, {
            imageIds: fileIds.map((v)=>v.fileId)
        });
    } else throw new Error("Unable to upload files!");
};






const $3ee52bcfba46d30d$export$b916619e652ca675 = async ({ data: data, ctx: ctx, success: success, fail: fail, state: state })=>{
    try {
        ctx.forms.initial.clearAllErrors();
        const token = await grecaptcha.execute(state.captchaKey, {
            action: "submit"
        });
        const resp = await (0, $9875fc359f01f731$export$a6b4d7d396320855)({
            captchaToken: token,
            phoneNumber: data.phone,
            carNumber: data.plateNumber,
            language: "et",
            formType: "BUYOUT",
            formSource: "CARBUY_ORIGIN"
        });
        state.formId.set(resp.formUuid);
        if (resp.mntData) {
            const { mark: mark, model: model, firstRegYear: firstRegYear, registrationNumber: registrationNumber } = resp.mntData;
            ctx.forms.vehicle.setFormValues({
                phone: data.phone,
                make: mark,
                model: model,
                year: (0, $7546c35f5f2b619a$export$ec46e854364465e6)(firstRegYear, String, ""),
                plateNumber: registrationNumber
            });
        } else ctx.forms.vehicle.setFormValues({
            phone: data.phone,
            plateNumber: data.plateNumber
        });
        success();
    } catch (e) {
        if (e instanceof (0, $f20d18f353317b2a$export$f2e832acab1bdd79)) {
            if (e.response.status === 400) {
                const { errorCode: errorCode } = await (0, $f20d18f353317b2a$export$7780d7826aafbede)(e.response);
                if (errorCode === "INVALID_PHONE_NUMBER") fail(state.messages.invalidPhoneError);
                else fail(state.messages.internalError);
            } else if (e.response.status === 403) fail("Captcha error");
            else {
                // eslint-disable-next-line no-console
                console.error("Response error: ", e);
                fail(state.messages.internalError);
            }
        } else {
            // eslint-disable-next-line no-console
            console.error("Response error: ", e);
            fail(state.messages.internalError);
        }
    }
};
const $3ee52bcfba46d30d$export$9af790bd8a0132a2 = async ({ data: { plateNumber: plateNumber }, ctx: ctx, success: success, fail: fail, state: state })=>{
    try {
        ctx.forms.vehicle.clearAllErrors();
        const resp = await (0, $9875fc359f01f731$export$8bdb25a87ae6a6fa)(plateNumber);
        if (resp) {
            const { mark: mark, model: model, firstRegYear: firstRegYear, registrationNumber: registrationNumber } = resp;
            ctx.forms.vehicle.setFormValues({
                make: mark,
                model: model,
                year: (0, $7546c35f5f2b619a$export$ec46e854364465e6)(firstRegYear, String, ""),
                plateNumber: registrationNumber
            });
            success();
        }
    } catch (e) {
        if (e instanceof (0, $f20d18f353317b2a$export$f2e832acab1bdd79) && e.response.status === 400) {
            const { errorCode: errorCode } = await (0, $f20d18f353317b2a$export$7780d7826aafbede)(e.response);
            if (errorCode === "CAR_NOT_FOUND") fail(state.messages.vehicleNotFoundError);
            else fail(state.messages.internalError);
        } else {
            // eslint-disable-next-line no-console
            console.error("Response error: ", e);
            fail(state.messages.internalError);
        }
    }
};
const $3ee52bcfba46d30d$export$8d5773d32b4cfd23 = async ({ data: data, ctx: ctx, success: success, fail: fail, state: state })=>{
    const formId = state.formId.get();
    if (!formId) throw new Error("FormId is missing");
    try {
        ctx.forms.vehicle.clearAllErrors();
        await (0, $9875fc359f01f731$export$e7cdd9ab52da88de)(formId, {
            carNumber: data.plateNumber,
            mark: data.make,
            model: data.model,
            mileage: (0, $7546c35f5f2b619a$export$4f84e3a82c7b538)(data.mileage, Number),
            location: data.location,
            requestedPrice: Number(data.price),
            fullName: data.name,
            email: data.email
        });
        ctx.labels.markAndModel.setLabel(`${data.make}, ${data.model}`);
        ctx.labels.plateNumber.setLabel(data.plateNumber);
        success();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Response error:", e);
        fail(state.messages.internalError);
    }
};
const $3ee52bcfba46d30d$export$cc36134c338ba9da = async ({ data: data, ctx: ctx, success: success, fail: fail, state: state })=>{
    const formId = state.formId.get();
    if (!formId) throw new Error("FormId is missing");
    try {
        ctx.forms.files.clearAllErrors();
        if (data?.files) {
            if (data.files instanceof FileList && data.files.length > 0) await (0, $9875fc359f01f731$export$42404212ef451a92)(formId, data.files);
            else if (data.files instanceof File) await (0, $9875fc359f01f731$export$42404212ef451a92)(formId, [
                data.files
            ]);
            else {
                // eslint-disable-next-line no-console
                console.error("Invalid files submitted: ", data);
                fail(state.messages.internalError);
            }
        }
        ctx.resetAll();
        success();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Response error:", e);
        fail(state.messages.internalError);
    }
};






const $15451612c40a4a0c$var$setVisibilityForAll = (selector, value)=>{
    if (selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el)=>{
            $15451612c40a4a0c$var$setElementVisible(el, value);
        });
    }
};
const $15451612c40a4a0c$var$setElementVisible = (el, value)=>{
    el.style.display = value ? "flex" : "none";
};
const $15451612c40a4a0c$export$cd874e48ff214f68 = (conf)=>{
    const state = {
        formId: (0, $7546c35f5f2b619a$export$e6a0daad8304de)(undefined),
        messages: conf.messages,
        captchaKey: conf.captchaKey
    };
    const beforeSubmit = (form)=>{
        form.setFormDisabled(true);
        $15451612c40a4a0c$var$setVisibilityForAll(conf.loaderSelector, true);
    };
    const afterSubmit = (form)=>{
        form.setFormDisabled(false);
        $15451612c40a4a0c$var$setVisibilityForAll(conf.loaderSelector, false);
    };
    const withSubmitAction = async (form, action)=>{
        beforeSubmit(form);
        await action().finally(()=>afterSubmit(form));
    };
    const labelConfig = {
        markAndModel: {
            selector: conf.labelSelectors.markAndModel
        },
        plateNumber: {
            selector: conf.labelSelectors.plateNumber
        }
    };
    /*
  // TODO: Correct approach is to map over config entries
  Object.entries<string>(conf.labelSelectors)
  .map(([labelName, selector]) => ({
    [labelName]: {
      selector: selector
    }
  }))
  .reduce((acc, val) => ({ ...acc, ...val }), {})
   */ const buttonConfig = {
        updateVehicle: {
            selector: conf.buttonSelectors.updateVehicle,
            onClick: (ctx)=>{
                withSubmitAction(ctx.forms.vehicle, async ()=>{
                    const plateNumber = ctx.forms.vehicle.fields.plateNumber.input.el.value;
                    await (0, $3ee52bcfba46d30d$export$9af790bd8a0132a2)({
                        data: {
                            plateNumber: plateNumber
                        },
                        ctx: ctx,
                        success: ()=>{},
                        fail: (error)=>ctx.forms.vehicle.setError(error),
                        state: state
                    });
                });
            }
        }
    };
    const initialFormConfig = {
        selector: '[data-dm-id="form_find_vehicle"]',
        onSuccess: (ctx)=>{
            conf.actions.switchStep(1, ctx);
        },
        onError: (error, ctx)=>{
            ctx.forms.initial.setError(error);
        },
        onSubmit: (data, ctx, success, fail)=>(0, $3ee52bcfba46d30d$export$b916619e652ca675)({
                data: data,
                ctx: ctx,
                success: success,
                fail: fail,
                state: state
            })
    };
    const vehicleErrorMessages = {
        pattern: state.messages.invalidEmailError
    };
    const vehicleFormConfig = {
        selector: '[data-dm-id="form_vehicle"]',
        errorMessages: vehicleErrorMessages,
        onSuccess: (ctx)=>{
            conf.actions.switchStep(2, ctx);
        },
        onError: (error, ctx)=>{
            ctx.forms.vehicle.setError(error);
        },
        onSubmit: (data, ctx, success, fail)=>(0, $3ee52bcfba46d30d$export$8d5773d32b4cfd23)({
                data: data,
                ctx: ctx,
                success: success,
                fail: fail,
                state: state
            })
    };
    const filesFormConfig = {
        selector: '[data-dm-id="form_files"]',
        onSuccess: (ctx)=>{
            conf.actions.switchStep(3, ctx);
        },
        onError: (error, ctx)=>{
            ctx.forms.files.setError(error);
        },
        onSubmit: (data, ctx, success, fail)=>(0, $3ee52bcfba46d30d$export$cc36134c338ba9da)({
                data: data,
                ctx: ctx,
                success: success,
                fail: fail,
                state: state
            })
    };
    const cfg = {
        forms: {
            initial: initialFormConfig,
            vehicle: vehicleFormConfig,
            files: filesFormConfig
        },
        buttons: buttonConfig,
        labels: labelConfig,
        handlers: {
            beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
        },
        errorMessages: conf.errorMessages,
        afterInit: ()=>{
            $15451612c40a4a0c$var$setVisibilityForAll(conf.loaderSelector, false);
        }
    };
    (0, $0564b07561875788$export$2cd8252107eb640b)(cfg);
};


//# sourceMappingURL=main.js.map
