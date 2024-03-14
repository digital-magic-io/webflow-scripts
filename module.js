const $a8cec6fe269f4471$var$apiUrl = "https://test.carprof.ee/api/v1";
const $a8cec6fe269f4471$var$formsUrl = `${$a8cec6fe269f4471$var$apiUrl}/forms`;
const $a8cec6fe269f4471$var$externalUrl = `${$a8cec6fe269f4471$var$apiUrl}/external`;
const $a8cec6fe269f4471$var$fileUrl = `${$a8cec6fe269f4471$var$formsUrl}/file`;
const $a8cec6fe269f4471$var$clientUrl = `${$a8cec6fe269f4471$var$externalUrl}/personal-data`;
const $a8cec6fe269f4471$var$buyoutUrl = (formId)=>`${$a8cec6fe269f4471$var$externalUrl}/buyout/${formId}`;
const $a8cec6fe269f4471$var$lookupCarRegistryUrl = (plateNumber)=>`${$a8cec6fe269f4471$var$apiUrl}/cars/mnt/${plateNumber}`;
const $a8cec6fe269f4471$var$fetchTyped = async (url, init = {
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
const $a8cec6fe269f4471$var$getTyped = async (url)=>$a8cec6fe269f4471$var$fetchTyped(url);
const $a8cec6fe269f4471$var$postTyped = async (url, body)=>$a8cec6fe269f4471$var$fetchTyped(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    });
const $a8cec6fe269f4471$export$7d7650bf4871ff57 = ()=>$a8cec6fe269f4471$var$getTyped($a8cec6fe269f4471$var$clientUrl);
const $a8cec6fe269f4471$export$3e93138bfea324f5 = (request)=>$a8cec6fe269f4471$var$postTyped($a8cec6fe269f4471$var$clientUrl, request);
const $a8cec6fe269f4471$export$30f6785ef4f50942 = (file)=>{
    const data = new FormData();
    data.append("file", file);
    return $a8cec6fe269f4471$var$fetchTyped($a8cec6fe269f4471$var$fileUrl, {
        method: "POST",
        body: data
    });
};
const $a8cec6fe269f4471$export$ad2c850047bf833d = (formId, request)=>$a8cec6fe269f4471$var$postTyped($a8cec6fe269f4471$var$buyoutUrl(formId), request);
const $a8cec6fe269f4471$export$a716ac162dff6323 = (plateNumber)=>$a8cec6fe269f4471$var$getTyped($a8cec6fe269f4471$var$lookupCarRegistryUrl(plateNumber));
const $a8cec6fe269f4471$export$dd1bc94b04021eeb = (value)=>value === null || value === undefined;
const $a8cec6fe269f4471$export$96bdbc84526f3739 = (value)=>!$a8cec6fe269f4471$export$dd1bc94b04021eeb(value);
const $a8cec6fe269f4471$export$bc226234bbb4652f = (files)=>{
    const result = [];
    if ($a8cec6fe269f4471$export$96bdbc84526f3739(files)) for (const file of files)result.push(file);
    return result;
};
const $a8cec6fe269f4471$export$7b64c937225679ee = (upload, onFileUploadSuccess, onFileUploadError)=>(files)=>Promise.all(files.map((file)=>upload(file).then((result)=>{
                onFileUploadSuccess?.();
                return result;
            }).catch((e)=>{
                // eslint-disable-next-line no-console
                console.error("File upload error", e);
                onFileUploadError?.(e);
                return undefined;
            }))).then((result)=>result.filter($a8cec6fe269f4471$export$96bdbc84526f3739));


const $88a503c130ee9998$export$de8d8c292714e7f9 = [
    "control",
    "label",
    "error",
    "input"
];
const $88a503c130ee9998$export$15bcbdcbe1072762 = [
    "error",
    "success",
    "default"
];


const $1b4bcbb7f8d5210f$var$getElement = (path)=>{
    const el = document.querySelector(path);
    if (el === null) {
        console.error(`Element not found by path: ${path}.`);
        return undefined;
    } else return el;
};
const $1b4bcbb7f8d5210f$var$createDmElement = (el, name)=>{
    return {
        el: el,
        id: el.attributes.getNamedItem("data-dm-id")?.value,
        name: name ?? el.attributes.getNamedItem("data-dm-name")?.value,
        type: el.attributes.getNamedItem("data-dm-type")?.value,
        show: ()=>{
            el.style.display = "block";
        },
        hide: ()=>{
            el.style.display = "none";
        }
    };
};
const $1b4bcbb7f8d5210f$var$createDmElementOpt = (el, name)=>el ? $1b4bcbb7f8d5210f$var$createDmElement(el, name) : undefined;
const $1b4bcbb7f8d5210f$export$83595b84fc78b9b4 = (id)=>$1b4bcbb7f8d5210f$var$getElement(`[data-dm-id="${id}"]`);
const $1b4bcbb7f8d5210f$var$getElementChildByType = (name, type)=>$1b4bcbb7f8d5210f$var$getElement(`[data-dm-name="${name}"] [data-dm-type="${type}"]`);
const $1b4bcbb7f8d5210f$var$getElementChildByName = (id, name)=>$1b4bcbb7f8d5210f$var$getElement(`[data-dm-id="${id}"] [data-dm-name="${name}"]`);
const $1b4bcbb7f8d5210f$var$getField = (name)=>{
    const field = $1b4bcbb7f8d5210f$var$getElement(`[data-dm-name="${name}"]`);
    const getErrorEl = ()=>$1b4bcbb7f8d5210f$var$getElementChildByType(name, "error");
    const setState = (state)=>{
        const el = getErrorEl();
        if (el) {
            (0, $88a503c130ee9998$export$15bcbdcbe1072762).map((s)=>`field-state-${s}`).filter((v)=>el.classList.contains(v)).forEach((s)=>el.classList.remove(s));
            el.classList.add(`field-state-${state}`);
        }
    };
    if (field) return {
        ...$1b4bcbb7f8d5210f$var$createDmElement(field, name),
        getLabel: ()=>$1b4bcbb7f8d5210f$var$createDmElementOpt($1b4bcbb7f8d5210f$var$getElementChildByType(name, "label")),
        getInput: ()=>$1b4bcbb7f8d5210f$var$createDmElementOpt($1b4bcbb7f8d5210f$var$getElementChildByType(name, "input")),
        setInputValue: (value)=>{
            $1b4bcbb7f8d5210f$var$getElementChildByType(name, "input")?.setAttribute("value", value);
        },
        getError: ()=>$1b4bcbb7f8d5210f$var$createDmElementOpt(getErrorEl()),
        setState: setState,
        clearError () {
            const el = getErrorEl();
            if (el) {
                setState("default");
                el.innerHTML = "";
            }
        },
        setError: (error)=>{
            const el = getErrorEl();
            if (el) {
                setState("error");
                el.innerHTML = error;
            }
        }
    };
    else return undefined;
};
const $1b4bcbb7f8d5210f$export$52987f4b88db0f2 = (form, handler)=>{
    form.action = "";
    form.method = "";
    form.onsubmit = (e)=>{
        e.preventDefault();
        e.stopPropagation();
    };
    // TODO: Remove all event listeners
    form.addEventListener("submit", handler);
};
const $1b4bcbb7f8d5210f$export$830c804e8d921bba = (name)=>{
    const form = $1b4bcbb7f8d5210f$var$getElement(`[data-dm-id="${name}"]`);
    const getErrorEl = ()=>$1b4bcbb7f8d5210f$var$getElementChildByName(name, "form_error");
    if (form) return {
        name: name,
        el: form,
        show: ()=>{
            form.style.display = "block";
        },
        hide: ()=>{
            form.style.display = "none";
        },
        getField: $1b4bcbb7f8d5210f$var$getField,
        getError: ()=>$1b4bcbb7f8d5210f$var$createDmElementOpt(getErrorEl()),
        clearError () {
            const el = getErrorEl();
            if (el) el.innerHTML = "";
        },
        setError: (error)=>{
            const el = getErrorEl();
            if (el) el.innerHTML = error;
        },
        setOnSubmit: (handler)=>$1b4bcbb7f8d5210f$export$52987f4b88db0f2(form, handler)
    };
    else return undefined;
};


const $f54879c0966825ba$export$dd1bc94b04021eeb = (value)=>value === null || value === undefined;
const $f54879c0966825ba$export$4d09d4ac8ba225dd = (field, validator, errMsg)=>{
    const value = field.input.el.value;
    if (!validator(value)) {
        field.setError(errMsg());
        return undefined;
    }
    return value;
};
const $f54879c0966825ba$export$c6f9402c221ec23f = (field)=>$f54879c0966825ba$export$4d09d4ac8ba225dd(field, (value)=>!!value && value.length > 0, ()=>"This field must be filled!");
const $f54879c0966825ba$export$18148d12c805c5b0 = (field)=>$f54879c0966825ba$export$4d09d4ac8ba225dd(field, (value)=>!!value && value.includes("@"), ()=>"Invalid email!");


const $e765043ad39a7a25$var$getFormFields = (form, fieldNames)=>{
    const fields = fieldNames.map((name)=>form.getField(name));
    if (fields.length !== fieldNames.length) {
        console.error("Form should have all fields!", fieldNames);
        form.setError("Unexpected error: missing fields!");
        return undefined;
    } else return fields;
};
const $e765043ad39a7a25$var$createRecord = (arr, propertyName)=>{
    const record = {};
    arr.forEach((item)=>{
        const key = item[propertyName];
        record[key] = item;
    });
    return record;
};
const $e765043ad39a7a25$export$b1af796fd1475484 = (form, fieldNames)=>{
    const fields = $e765043ad39a7a25$var$getFormFields(form, fieldNames);
    if (!fields) throw new Error("Form should have all fields!");
    const fieldInstances = fields.map((field)=>{
        const label = field.getLabel();
        const input = field.getInput();
        const error = field.getError();
        if (!label || !input || !error) {
            console.error("Form field must have label, input, error elements!", field.name, field.el);
            throw new Error("Form field must have label, input, error elements!");
        }
        return {
            label: label,
            input: input,
            error: error,
            id: field.id,
            name: field.name,
            type: field.type,
            el: field.el,
            show: ()=>field.show(),
            hide: ()=>field.hide(),
            clearError: ()=>field.clearError(),
            setError: (error)=>field.setError(error),
            setState: (state)=>field.setState(state),
            setInputValue: (value)=>field.setInputValue(value)
        };
    });
    const error = form.getError();
    if (!error) {
        console.error("Form must have error element!", form.el);
        throw new Error("Form must have error element!");
    }
    return {
        id: form.id,
        name: form.name,
        type: form.type,
        el: form.el,
        show: ()=>form.show(),
        hide: ()=>form.hide(),
        fields: $e765043ad39a7a25$var$createRecord(fieldInstances, "name"),
        error: error,
        clearError: ()=>form.clearError(),
        clearAllErrors: ()=>{
            form.clearError();
            fieldInstances.forEach((field)=>field.clearError());
        },
        setError: (error)=>form.setError(error),
        setOnSubmit: (handler)=>form.setOnSubmit(handler)
    };
};


const $b3a133cf85b0ceb6$var$handleSubmitClient = (conf, storage, form)=>(e)=>{
        console.log("Form submitted", e.target);
        form.clearAllErrors();
        const name = (0, $f54879c0966825ba$export$c6f9402c221ec23f)(form.fields.name);
        const email = (0, $f54879c0966825ba$export$18148d12c805c5b0)(form.fields.email);
        const phoneNumber = (0, $f54879c0966825ba$export$c6f9402c221ec23f)(form.fields.phone);
        if (!name || !email || !phoneNumber) return;
        const client = {
            formType: "BUYOUT",
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            language: "et"
        };
        (0, $a8cec6fe269f4471$export$3e93138bfea324f5)(client).then((resp)=>{
            storage.setState({
                ...storage.state,
                client: resp
            });
            console.log(`State updated: ${JSON.stringify(storage)}`);
            conf.stepper.nextStepFn(1);
        }).catch((error)=>{
            console.error("API error:", error);
            form.setError("Unable to send client data!");
        });
    };
const $b3a133cf85b0ceb6$var$handleSubmitSearchVehicle = (storage, form, vehicleForm)=>(e)=>{
        console.log("Form submitted", e.target);
        form.clearAllErrors();
        const plateNumber = (0, $f54879c0966825ba$export$c6f9402c221ec23f)(form.fields.plateNumber);
        if (!plateNumber) return;
        console.log("Plate number:", plateNumber);
        (0, $a8cec6fe269f4471$export$a716ac162dff6323)(plateNumber).then((response)=>{
            console.log("Car response:", response);
            vehicleForm.fields.make.setInputValue(response.mark);
            vehicleForm.fields.model.setInputValue(response.model);
            vehicleForm.fields.year.setInputValue(String(response.firstRegYear));
            storage.setState({
                ...storage.state,
                form: {
                    ...storage.state.form,
                    plateNumber: plateNumber
                }
            });
            console.log(`State updated: ${JSON.stringify(storage)}`);
            vehicleForm.show();
        }).catch((error)=>{
            console.error("Car error:", error);
            form.fields.plateNumber.setError("Car not found!");
        });
    };
const $b3a133cf85b0ceb6$var$handleSubmitVehicle = (conf, storage, form)=>(e)=>{
        console.log("Form submitted", e.target);
        form.clearAllErrors();
        const make = (0, $f54879c0966825ba$export$c6f9402c221ec23f)(form.fields.make);
        const model = (0, $f54879c0966825ba$export$c6f9402c221ec23f)(form.fields.model);
        const year = (0, $f54879c0966825ba$export$c6f9402c221ec23f)(form.fields.year);
        const mileage = (0, $f54879c0966825ba$export$c6f9402c221ec23f)(form.fields.mileage);
        const location = form.fields.location?.input.el.value;
        const price = (0, $f54879c0966825ba$export$c6f9402c221ec23f)(form.fields.price);
        const message = form.fields.message?.input.el.value;
        if (!make || !model || !year || !mileage || !price) return;
        if (storage.state.form.plateNumber === undefined) throw new Error("Plate number is not set!");
        const request = {
            plateNumber: storage.state.form.plateNumber,
            make: make,
            model: model,
            year: Number(year),
            mileage: Number(mileage),
            location: location,
            price: Number(price),
            additionalInfo: message,
            photoIds: []
        };
        console.log(`Submitted: request=${JSON.stringify(request)}`);
        storage.setState({
            ...storage.state,
            form: request
        });
        console.log(`State updated: ${JSON.stringify(storage)}`);
        conf.stepper.nextStepFn(2);
    };
const $b3a133cf85b0ceb6$var$handleSubmitFiles = (conf, storage, form)=>(e)=>{
        console.log("Form submitted", e.target);
        form.clearAllErrors();
        const files = form.fields.files.input.el.files;
        if (!files || files.length === 0) {
            form.fields.files.setError("Files must be selected!");
            return;
        } else if (files && files.length > 10) {
            form.fields.files.setError("Maximum 10 files allowed!");
            return;
        }
        console.log("Files:", files);
        const uploadFiles = (0, $a8cec6fe269f4471$export$7b64c937225679ee)((0, $a8cec6fe269f4471$export$30f6785ef4f50942));
        uploadFiles((0, $a8cec6fe269f4471$export$bc226234bbb4652f)(files)).then((response)=>{
            const photoIds = response.map((v)=>v.fileId);
            storage.setState({
                ...storage.state,
                form: {
                    ...storage.state.form,
                    photoIds: photoIds
                }
            });
            console.log(`State updated: ${JSON.stringify(storage)}`);
            if (storage.state.client) (0, $a8cec6fe269f4471$export$ad2c850047bf833d)(storage.state.client.personalDataId, storage.state.form).then(()=>{
                console.log("Success!");
                conf.stepper.nextStepFn(3);
            });
            else form.setError("Client is not set!");
        });
    };
const $b3a133cf85b0ceb6$var$initForm = (name, fieldNames)=>{
    const form = (0, $1b4bcbb7f8d5210f$export$830c804e8d921bba)(name);
    if (form) //form.setOnSubmit(handler(form))
    return (0, $e765043ad39a7a25$export$b1af796fd1475484)(form, fieldNames);
    else {
        // eslint-disable-next-line no-console
        console.error("Client form not found!");
        return undefined;
    }
};
const $b3a133cf85b0ceb6$export$2cd8252107eb640b = (conf)=>{
    console.log("Initializing...", conf);
    const storage = {
        state: {
            client: undefined,
            form: {}
        },
        setState (value) {
            storage.state = value;
        }
    };
    const clientForm = $b3a133cf85b0ceb6$var$initForm(conf.forms.client, [
        "name",
        "email",
        "phone"
    ]);
    const findVehicleForm = $b3a133cf85b0ceb6$var$initForm(conf.forms.findVehicle, [
        "plateNumber"
    ]);
    const vehicleForm = $b3a133cf85b0ceb6$var$initForm(conf.forms.vehicle, [
        "make",
        "model",
        "year",
        "mileage",
        "location",
        "price",
        "message"
    ]);
    const filesForm = $b3a133cf85b0ceb6$var$initForm(conf.forms.files, [
        "files"
    ]);
    if (!clientForm || !findVehicleForm || !vehicleForm || !filesForm) throw new Error("Not all forms are found!");
    clientForm.setOnSubmit($b3a133cf85b0ceb6$var$handleSubmitClient(conf, storage, clientForm));
    findVehicleForm.setOnSubmit($b3a133cf85b0ceb6$var$handleSubmitSearchVehicle(storage, findVehicleForm, vehicleForm));
    vehicleForm.setOnSubmit($b3a133cf85b0ceb6$var$handleSubmitVehicle(conf, storage, vehicleForm));
    filesForm.setOnSubmit($b3a133cf85b0ceb6$var$handleSubmitFiles(conf, storage, filesForm));
};


export {$b3a133cf85b0ceb6$export$2cd8252107eb640b as init};
//# sourceMappingURL=module.js.map
