
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "init", function () { return $15451612c40a4a0c$export$2cd8252107eb640b; });
const $542eefcd7729cbce$var$apiUrl = "https://test.carprof.ee/api/v1";
const $542eefcd7729cbce$var$formsUrl = `${$542eefcd7729cbce$var$apiUrl}/forms`;
const $542eefcd7729cbce$var$externalUrl = `${$542eefcd7729cbce$var$apiUrl}/external`;
const $542eefcd7729cbce$var$fileUrl = `${$542eefcd7729cbce$var$formsUrl}/file`;
const $542eefcd7729cbce$var$clientUrl = `${$542eefcd7729cbce$var$externalUrl}/personal-data`;
const $542eefcd7729cbce$var$buyoutUrl = (formId)=>`${$542eefcd7729cbce$var$externalUrl}/buyout/${formId}`;
const $542eefcd7729cbce$var$lookupCarRegistryUrl = (plateNumber)=>`${$542eefcd7729cbce$var$apiUrl}/cars/mnt/${plateNumber}`;
const $542eefcd7729cbce$var$fetchTyped = async (url, init = {
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
const $542eefcd7729cbce$var$getTyped = async (url)=>$542eefcd7729cbce$var$fetchTyped(url);
const $542eefcd7729cbce$var$postTyped = async (url, body)=>$542eefcd7729cbce$var$fetchTyped(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    });
const $542eefcd7729cbce$export$7d7650bf4871ff57 = ()=>$542eefcd7729cbce$var$getTyped($542eefcd7729cbce$var$clientUrl);
const $542eefcd7729cbce$export$3e93138bfea324f5 = (request)=>$542eefcd7729cbce$var$postTyped($542eefcd7729cbce$var$clientUrl, request);
const $542eefcd7729cbce$export$30f6785ef4f50942 = (file)=>{
    const data = new FormData();
    data.append("file", file);
    return $542eefcd7729cbce$var$fetchTyped($542eefcd7729cbce$var$fileUrl, {
        method: "POST",
        body: data
    });
};
const $542eefcd7729cbce$export$ad2c850047bf833d = (formId, request)=>$542eefcd7729cbce$var$postTyped($542eefcd7729cbce$var$buyoutUrl(formId), request);
const $542eefcd7729cbce$export$a716ac162dff6323 = (plateNumber)=>$542eefcd7729cbce$var$getTyped($542eefcd7729cbce$var$lookupCarRegistryUrl(plateNumber));
const $542eefcd7729cbce$export$dd1bc94b04021eeb = (value)=>value === null || value === undefined;
const $542eefcd7729cbce$export$96bdbc84526f3739 = (value)=>!$542eefcd7729cbce$export$dd1bc94b04021eeb(value);
const $542eefcd7729cbce$export$bc226234bbb4652f = (files)=>{
    const result = [];
    if ($542eefcd7729cbce$export$96bdbc84526f3739(files)) for (const file of files)result.push(file);
    return result;
};
const $542eefcd7729cbce$export$7b64c937225679ee = (upload, onFileUploadSuccess, onFileUploadError)=>(files)=>Promise.all(files.map((file)=>upload(file).then((result)=>{
                onFileUploadSuccess?.();
                return result;
            }).catch((e)=>{
                // eslint-disable-next-line no-console
                console.error("File upload error", e);
                onFileUploadError?.(e);
                return undefined;
            }))).then((result)=>result.filter($542eefcd7729cbce$export$96bdbc84526f3739));


const $9f7d2dc322d4f51a$export$de8d8c292714e7f9 = [
    "control",
    "label",
    "error",
    "input"
];
const $9f7d2dc322d4f51a$export$15bcbdcbe1072762 = [
    "error",
    "success",
    "default"
];


const $be94f3f256e85d52$var$getElement = (path)=>{
    const el = document.querySelector(path);
    if (el === null) {
        console.error(`Element not found by path: ${path}.`);
        return undefined;
    } else return el;
};
const $be94f3f256e85d52$var$createDmElement = (el, name)=>{
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
const $be94f3f256e85d52$var$createDmElementOpt = (el, name)=>el ? $be94f3f256e85d52$var$createDmElement(el, name) : undefined;
const $be94f3f256e85d52$export$83595b84fc78b9b4 = (id)=>$be94f3f256e85d52$var$getElement(`[data-dm-id="${id}"]`);
const $be94f3f256e85d52$var$getElementChildByType = (name, type)=>$be94f3f256e85d52$var$getElement(`[data-dm-name="${name}"] [data-dm-type="${type}"]`);
const $be94f3f256e85d52$var$getElementChildByName = (id, name)=>$be94f3f256e85d52$var$getElement(`[data-dm-id="${id}"] [data-dm-name="${name}"]`);
const $be94f3f256e85d52$var$getField = (name)=>{
    const field = $be94f3f256e85d52$var$getElement(`[data-dm-name="${name}"]`);
    const getErrorEl = ()=>$be94f3f256e85d52$var$getElementChildByType(name, "error");
    const setState = (state)=>{
        const el = getErrorEl();
        if (el) {
            (0, $9f7d2dc322d4f51a$export$15bcbdcbe1072762).map((s)=>`field-state-${s}`).filter((v)=>el.classList.contains(v)).forEach((s)=>el.classList.remove(s));
            el.classList.add(`field-state-${state}`);
        }
    };
    if (field) return {
        ...$be94f3f256e85d52$var$createDmElement(field, name),
        getLabel: ()=>$be94f3f256e85d52$var$createDmElementOpt($be94f3f256e85d52$var$getElementChildByType(name, "label")),
        getInput: ()=>$be94f3f256e85d52$var$createDmElementOpt($be94f3f256e85d52$var$getElementChildByType(name, "input")),
        setInputValue: (value)=>{
            $be94f3f256e85d52$var$getElementChildByType(name, "input")?.setAttribute("value", value);
        },
        getError: ()=>$be94f3f256e85d52$var$createDmElementOpt(getErrorEl()),
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
const $be94f3f256e85d52$export$52987f4b88db0f2 = (form, handler)=>{
    form.action = "";
    form.method = "";
    form.onsubmit = (e)=>{
        e.preventDefault();
        e.stopPropagation();
    };
    // TODO: Remove all event listeners
    form.addEventListener("submit", handler);
};
const $be94f3f256e85d52$export$830c804e8d921bba = (name)=>{
    const form = $be94f3f256e85d52$var$getElement(`[data-dm-id="${name}"]`);
    const getErrorEl = ()=>$be94f3f256e85d52$var$getElementChildByName(name, "form_error");
    if (form) return {
        name: name,
        el: form,
        show: ()=>{
            form.style.display = "block";
        },
        hide: ()=>{
            form.style.display = "none";
        },
        getField: $be94f3f256e85d52$var$getField,
        getError: ()=>$be94f3f256e85d52$var$createDmElementOpt(getErrorEl()),
        clearError () {
            const el = getErrorEl();
            if (el) el.innerHTML = "";
        },
        setError: (error)=>{
            const el = getErrorEl();
            if (el) el.innerHTML = error;
        },
        setOnSubmit: (handler)=>$be94f3f256e85d52$export$52987f4b88db0f2(form, handler)
    };
    else return undefined;
};


const $a432bf2f0787dfa2$export$dd1bc94b04021eeb = (value)=>value === null || value === undefined;
const $a432bf2f0787dfa2$export$4d09d4ac8ba225dd = (field, validator, errMsg)=>{
    const value = field.input.el.value;
    if (!validator(value)) {
        field.setError(errMsg());
        return undefined;
    }
    return value;
};
const $a432bf2f0787dfa2$export$c6f9402c221ec23f = (field)=>$a432bf2f0787dfa2$export$4d09d4ac8ba225dd(field, (value)=>!!value && value.length > 0, ()=>"This field must be filled!");
const $a432bf2f0787dfa2$export$18148d12c805c5b0 = (field)=>$a432bf2f0787dfa2$export$4d09d4ac8ba225dd(field, (value)=>!!value && value.includes("@"), ()=>"Invalid email!");


const $f893617372f114e3$var$getFormFields = (form, fieldNames)=>{
    const fields = fieldNames.map((name)=>form.getField(name));
    if (fields.length !== fieldNames.length) {
        console.error("Form should have all fields!", fieldNames);
        form.setError("Unexpected error: missing fields!");
        return undefined;
    } else return fields;
};
const $f893617372f114e3$var$createRecord = (arr, propertyName)=>{
    const record = {};
    arr.forEach((item)=>{
        const key = item[propertyName];
        record[key] = item;
    });
    return record;
};
const $f893617372f114e3$export$b1af796fd1475484 = (form, fieldNames)=>{
    const fields = $f893617372f114e3$var$getFormFields(form, fieldNames);
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
        fields: $f893617372f114e3$var$createRecord(fieldInstances, "name"),
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


const $15451612c40a4a0c$var$handleSubmitClient = (conf, storage, form)=>(e)=>{
        console.log("Form submitted", e.target);
        form.clearAllErrors();
        const name = (0, $a432bf2f0787dfa2$export$c6f9402c221ec23f)(form.fields.name);
        const email = (0, $a432bf2f0787dfa2$export$18148d12c805c5b0)(form.fields.email);
        const phoneNumber = (0, $a432bf2f0787dfa2$export$c6f9402c221ec23f)(form.fields.phone);
        if (!name || !email || !phoneNumber) return;
        const client = {
            formType: "BUYOUT",
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            language: "et"
        };
        (0, $542eefcd7729cbce$export$3e93138bfea324f5)(client).then((resp)=>{
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
const $15451612c40a4a0c$var$handleSubmitSearchVehicle = (storage, form, vehicleForm)=>(e)=>{
        console.log("Form submitted", e.target);
        form.clearAllErrors();
        const plateNumber = (0, $a432bf2f0787dfa2$export$c6f9402c221ec23f)(form.fields.plateNumber);
        if (!plateNumber) return;
        console.log("Plate number:", plateNumber);
        (0, $542eefcd7729cbce$export$a716ac162dff6323)(plateNumber).then((response)=>{
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
const $15451612c40a4a0c$var$handleSubmitVehicle = (conf, storage, form)=>(e)=>{
        console.log("Form submitted", e.target);
        form.clearAllErrors();
        const make = (0, $a432bf2f0787dfa2$export$c6f9402c221ec23f)(form.fields.make);
        const model = (0, $a432bf2f0787dfa2$export$c6f9402c221ec23f)(form.fields.model);
        const year = (0, $a432bf2f0787dfa2$export$c6f9402c221ec23f)(form.fields.year);
        const mileage = (0, $a432bf2f0787dfa2$export$c6f9402c221ec23f)(form.fields.mileage);
        const location = form.fields.location?.input.el.value;
        const price = (0, $a432bf2f0787dfa2$export$c6f9402c221ec23f)(form.fields.price);
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
const $15451612c40a4a0c$var$handleSubmitFiles = (conf, storage, form)=>(e)=>{
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
        const uploadFiles = (0, $542eefcd7729cbce$export$7b64c937225679ee)((0, $542eefcd7729cbce$export$30f6785ef4f50942));
        uploadFiles((0, $542eefcd7729cbce$export$bc226234bbb4652f)(files)).then((response)=>{
            const photoIds = response.map((v)=>v.fileId);
            storage.setState({
                ...storage.state,
                form: {
                    ...storage.state.form,
                    photoIds: photoIds
                }
            });
            console.log(`State updated: ${JSON.stringify(storage)}`);
            if (storage.state.client) (0, $542eefcd7729cbce$export$ad2c850047bf833d)(storage.state.client.personalDataId, storage.state.form).then(()=>{
                console.log("Success!");
                conf.stepper.nextStepFn(3);
            });
            else form.setError("Client is not set!");
        });
    };
const $15451612c40a4a0c$var$initForm = (name, fieldNames)=>{
    const form = (0, $be94f3f256e85d52$export$830c804e8d921bba)(name);
    if (form) //form.setOnSubmit(handler(form))
    return (0, $f893617372f114e3$export$b1af796fd1475484)(form, fieldNames);
    else {
        // eslint-disable-next-line no-console
        console.error("Client form not found!");
        return undefined;
    }
};
const $15451612c40a4a0c$export$2cd8252107eb640b = (conf)=>{
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
    const clientForm = $15451612c40a4a0c$var$initForm(conf.forms.client, [
        "name",
        "email",
        "phone"
    ]);
    const findVehicleForm = $15451612c40a4a0c$var$initForm(conf.forms.findVehicle, [
        "plateNumber"
    ]);
    const vehicleForm = $15451612c40a4a0c$var$initForm(conf.forms.vehicle, [
        "make",
        "model",
        "year",
        "mileage",
        "location",
        "price",
        "message"
    ]);
    const filesForm = $15451612c40a4a0c$var$initForm(conf.forms.files, [
        "files"
    ]);
    if (!clientForm || !findVehicleForm || !vehicleForm || !filesForm) throw new Error("Not all forms are found!");
    clientForm.setOnSubmit($15451612c40a4a0c$var$handleSubmitClient(conf, storage, clientForm));
    findVehicleForm.setOnSubmit($15451612c40a4a0c$var$handleSubmitSearchVehicle(storage, findVehicleForm, vehicleForm));
    vehicleForm.setOnSubmit($15451612c40a4a0c$var$handleSubmitVehicle(conf, storage, vehicleForm));
    filesForm.setOnSubmit($15451612c40a4a0c$var$handleSubmitFiles(conf, storage, filesForm));
};


//# sourceMappingURL=main.js.map
