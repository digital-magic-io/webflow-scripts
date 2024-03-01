
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


const $d5a221d013e48634$export$d16800b7e59a8051 = (path)=>{
    const el = document.querySelector(path);
    if (el === null) {
        console.error(`Element not found by path: ${path}.`);
        return undefined;
    } else return el;
};
const $d5a221d013e48634$export$7c112ceec8941e67 = (path)=>$d5a221d013e48634$export$d16800b7e59a8051(path);
const $d5a221d013e48634$export$a212451ed6854bb0 = (path, value)=>{
    const input = $d5a221d013e48634$export$7c112ceec8941e67(path);
    if (input) input.value = value;
};
const $d5a221d013e48634$export$830c804e8d921bba = (path)=>$d5a221d013e48634$export$d16800b7e59a8051(path);
const $d5a221d013e48634$export$ddf018cf7a99d36f = (path, msg)=>{
    const el = $d5a221d013e48634$export$d16800b7e59a8051(path);
    if (el) el.innerHTML = msg;
};
const $d5a221d013e48634$export$52987f4b88db0f2 = (path, handler)=>{
    const form = $d5a221d013e48634$export$830c804e8d921bba(path);
    if (form) {
        form.action = "";
        form.method = "";
        form.onsubmit = (e)=>{
            e.preventDefault();
            e.stopPropagation();
        };
        // TODO: Remove all event listeners
        form.addEventListener("submit", handler);
    } else console.error(`Unable to find form with id "${path}"`);
};
const $d5a221d013e48634$export$89a6f6b18f17322b = (path, handler)=>{
    const btn = $d5a221d013e48634$export$d16800b7e59a8051(path);
    if (btn) btn.onclick = handler;
    else console.error(`Unable to find button with id "${path}"`);
};


// TODO: Use functional State pattern
const $15451612c40a4a0c$var$state = {
    client: undefined,
    form: {}
};
const $15451612c40a4a0c$var$handleSubmitClient = (stepper, f)=>(e)=>{
        console.log("Form submitted", e.target);
        (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(f.msgError, "");
        const client = {
            formType: "BUYOUT",
            name: (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.txtName)?.value ?? "",
            email: (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.txtEmail)?.value ?? "",
            phoneNumber: (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.txtPhone)?.value ?? "",
            language: "et"
        };
        if (client.name && client.email && client.phoneNumber) (0, $542eefcd7729cbce$export$3e93138bfea324f5)(client).then((resp)=>{
            $15451612c40a4a0c$var$state.client = resp;
            console.log(`State updated: ${JSON.stringify($15451612c40a4a0c$var$state)}`);
            stepper.nextStepFn(1);
        }).catch((error)=>{
            console.error("API error:", error);
            (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(f.msgError, "Unable to send client data!");
        });
        else (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(f.msgError, "All fields must be filled!");
    };
const $15451612c40a4a0c$var$handleSubmitSearchVehicle = (f)=>(e)=>{
        console.log("Form submitted", e.target);
        (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(f.plateNumber.msgError, "");
        const plateNumber = (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.plateNumber.txtPlateNumber)?.value;
        if (plateNumber && plateNumber.length > 0) {
            console.log("Plate number:", plateNumber);
            (0, $542eefcd7729cbce$export$a716ac162dff6323)(plateNumber).then((response)=>{
                console.log("Car response:", response);
                (0, $d5a221d013e48634$export$a212451ed6854bb0)(f.txtMake, response.mark);
                (0, $d5a221d013e48634$export$a212451ed6854bb0)(f.txtModel, response.model);
                (0, $d5a221d013e48634$export$a212451ed6854bb0)(f.txtYear, String(response.firstRegYear));
            //setInput(f.txtMileage, )
            //setInput(f.txtLocation, )
            //setInput(f.txtPrice)
            //setInput()
            }).catch((error)=>{
                console.error("Car error:", error);
                (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(f.plateNumber.msgError, "Car not found!");
            });
        } else (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(f.plateNumber.msgError, "Plate number must be filled!");
    };
const $15451612c40a4a0c$var$handleSubmitVehicle = (stepper, f)=>(e)=>{
        console.log("Form submitted", e.target);
        (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(f.msgError, "");
        const make = (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.txtMake)?.value;
        const model = (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.txtModel)?.value;
        const year = (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.txtYear)?.value;
        const mileage = (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.txtMileage)?.value;
        const location = (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.txtLocation)?.value;
        const price = (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.txtPrice)?.value;
        const message = (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.txtMessage)?.value;
        const plateNumber = (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.plateNumber.txtPlateNumber)?.value;
        if (make && model && year && mileage && price && plateNumber) {
            const request = {
                registrationNumber: plateNumber,
                fuelId: 1,
                transmissionId: 1,
                imageIds: [],
                make: make,
                model: model,
                year: Number(year),
                mileage: Number(mileage),
                location: location,
                requestedPrice: Number(price),
                additionalInfo: message
            };
            console.log(`Submitted: request=${JSON.stringify(request)}`);
            $15451612c40a4a0c$var$state.form = request;
            console.log(`State updated: ${JSON.stringify($15451612c40a4a0c$var$state)}`);
            stepper.nextStepFn(2);
        } else (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(f.msgError, "All vehicle fields must be filled except message!");
    };
const $15451612c40a4a0c$var$handleSubmitFiles = (f, msgSuccess)=>(e)=>{
        console.log("Form submitted", e.target);
        (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(f.msgError, "");
        const files = (0, $d5a221d013e48634$export$7c112ceec8941e67)(f.inputFiles)?.files;
        if (files && files.length > 0) {
            console.log("Files:", files);
            const uploadFiles = (0, $542eefcd7729cbce$export$7b64c937225679ee)((0, $542eefcd7729cbce$export$30f6785ef4f50942));
            uploadFiles((0, $542eefcd7729cbce$export$bc226234bbb4652f)(files)).then((response)=>{
                $15451612c40a4a0c$var$state.form.imageIds = response.map((v)=>v.fileId);
                console.log(`State updated: ${JSON.stringify($15451612c40a4a0c$var$state)}`);
                if ($15451612c40a4a0c$var$state.client) (0, $542eefcd7729cbce$export$ad2c850047bf833d)($15451612c40a4a0c$var$state.client.personalDataId, $15451612c40a4a0c$var$state.form).then(()=>{
                    console.log("Success!");
                    (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(msgSuccess, "Great success!");
                });
                else (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(f.msgError, "client is not set!");
            });
        } else if (files && files.length > 10) (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(f.msgError, "Too many files selected!");
        else (0, $d5a221d013e48634$export$ddf018cf7a99d36f)(f.msgError, "Files must be selected!");
    };
const $15451612c40a4a0c$export$2cd8252107eb640b = (conf)=>{
    console.log("Initializing...", conf);
    (0, $d5a221d013e48634$export$52987f4b88db0f2)(conf.elements.stepClient.form, $15451612c40a4a0c$var$handleSubmitClient(conf.stepper, conf.elements.stepClient));
    (0, $d5a221d013e48634$export$52987f4b88db0f2)(conf.elements.stepVehicle.plateNumber.form, $15451612c40a4a0c$var$handleSubmitSearchVehicle(conf.elements.stepVehicle));
    (0, $d5a221d013e48634$export$52987f4b88db0f2)(conf.elements.stepVehicle.form, $15451612c40a4a0c$var$handleSubmitVehicle(conf.stepper, conf.elements.stepVehicle));
    (0, $d5a221d013e48634$export$52987f4b88db0f2)(conf.elements.stepFiles.form, $15451612c40a4a0c$var$handleSubmitFiles(conf.elements.stepFiles, conf.elements.msgSuccess));
};


//# sourceMappingURL=main.js.map
