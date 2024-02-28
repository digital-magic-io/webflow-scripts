const $a8cec6fe269f4471$var$apiUrl = "https://test.carprof.ee/api/v1";
const $a8cec6fe269f4471$var$formsUrl = `${$a8cec6fe269f4471$var$apiUrl}/forms`;
const $a8cec6fe269f4471$var$fileUrl = `${$a8cec6fe269f4471$var$formsUrl}/file`;
const $a8cec6fe269f4471$var$clientUrl = `${$a8cec6fe269f4471$var$formsUrl}/client`;
const $a8cec6fe269f4471$var$buyoutUrl = `${$a8cec6fe269f4471$var$formsUrl}/buyout`;
const $a8cec6fe269f4471$var$lookupCarRegistryUrl = (plateNumber)=>`${$a8cec6fe269f4471$var$apiUrl}/cars/mnt/${plateNumber}`;
const $a8cec6fe269f4471$var$fetchTyped = async (url, init = {
    method: "GET"
})=>{
    const response = await fetch(url, {
        credentials: "include",
        ...init
    });
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
const $a8cec6fe269f4471$export$ad2c850047bf833d = (request)=>$a8cec6fe269f4471$var$postTyped($a8cec6fe269f4471$var$buyoutUrl, request);
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


const $02ee45712bdfc733$export$d16800b7e59a8051 = (path)=>{
    const el = document.querySelector(path);
    if (el === null) {
        console.error(`Element not found by path: ${path}.`);
        return undefined;
    } else return el;
};
const $02ee45712bdfc733$export$7c112ceec8941e67 = (path)=>$02ee45712bdfc733$export$d16800b7e59a8051(path);
const $02ee45712bdfc733$export$a212451ed6854bb0 = (path, value)=>{
    const input = $02ee45712bdfc733$export$7c112ceec8941e67(path);
    if (input) input.value = value;
};
const $02ee45712bdfc733$export$830c804e8d921bba = (path)=>$02ee45712bdfc733$export$d16800b7e59a8051(path);
const $02ee45712bdfc733$export$ddf018cf7a99d36f = (path, msg)=>{
    const el = $02ee45712bdfc733$export$d16800b7e59a8051(path);
    if (el) el.innerHTML = msg;
};
const $02ee45712bdfc733$export$52987f4b88db0f2 = (path, handler)=>{
    const form = $02ee45712bdfc733$export$830c804e8d921bba(path);
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
const $02ee45712bdfc733$export$89a6f6b18f17322b = (path, handler)=>{
    const btn = $02ee45712bdfc733$export$d16800b7e59a8051(path);
    if (btn) btn.onclick = handler;
    else console.error(`Unable to find button with id "${path}"`);
};


// TODO: Use functional State pattern
const $b3a133cf85b0ceb6$var$state = {
    form: {}
};
const $b3a133cf85b0ceb6$var$handleSubmitClient = (stepper, f)=>(e)=>{
        console.log("Form submitted", e.target);
        (0, $02ee45712bdfc733$export$ddf018cf7a99d36f)(f.msgError, "");
        const client = {
            formType: "BUYOUT",
            name: (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.txtName)?.value ?? "",
            email: (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.txtEmail)?.value ?? "",
            phoneNumber: (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.txtPhone)?.value ?? "",
            language: "et"
        };
        if (client.name && client.email && client.phoneNumber) (0, $a8cec6fe269f4471$export$3e93138bfea324f5)(client).then(()=>{
            stepper.nextStepFn(1);
        }).catch((error)=>{
            console.error("API error:", error);
            (0, $02ee45712bdfc733$export$ddf018cf7a99d36f)(f.msgError, "Unable to send client data!");
        });
        else (0, $02ee45712bdfc733$export$ddf018cf7a99d36f)(f.msgError, "All fields must be filled!");
    };
const $b3a133cf85b0ceb6$var$handleSubmitSearchVehicle = (f)=>(e)=>{
        console.log("Form submitted", e.target);
        (0, $02ee45712bdfc733$export$ddf018cf7a99d36f)(f.plateNumber.msgError, "");
        const plateNumber = (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.plateNumber.txtPlateNumber)?.value;
        if (plateNumber && plateNumber.length > 0) {
            console.log("Plate number:", plateNumber);
            (0, $a8cec6fe269f4471$export$a716ac162dff6323)(plateNumber).then((response)=>{
                console.log("Car response:", response);
                (0, $02ee45712bdfc733$export$a212451ed6854bb0)(f.txtMake, response.mark);
                (0, $02ee45712bdfc733$export$a212451ed6854bb0)(f.txtModel, response.model);
                (0, $02ee45712bdfc733$export$a212451ed6854bb0)(f.txtYear, String(response.firstRegYear));
            //setInput(f.txtMileage, )
            //setInput(f.txtLocation, )
            //setInput(f.txtPrice)
            //setInput()
            }).catch((error)=>{
                console.error("Car error:", error);
                (0, $02ee45712bdfc733$export$ddf018cf7a99d36f)(f.plateNumber.msgError, "Car not found!");
            });
        } else (0, $02ee45712bdfc733$export$ddf018cf7a99d36f)(f.plateNumber.msgError, "Plate number must be filled!");
    };
const $b3a133cf85b0ceb6$var$handleSubmitVehicle = (stepper, f)=>(e)=>{
        console.log("Form submitted", e.target);
        (0, $02ee45712bdfc733$export$ddf018cf7a99d36f)(f.msgError, "");
        const make = (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.txtMake)?.value;
        const model = (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.txtModel)?.value;
        const year = (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.txtYear)?.value;
        const mileage = (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.txtMileage)?.value;
        const location = (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.txtLocation)?.value;
        const price = (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.txtPrice)?.value;
        const message = (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.txtMessage)?.value;
        const plateNumber = (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.plateNumber.txtPlateNumber)?.value;
        if (make && model && year && price && plateNumber) {
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
            $b3a133cf85b0ceb6$var$state.form = request;
            console.log(`State updated: ${JSON.stringify($b3a133cf85b0ceb6$var$state)}`);
            stepper.nextStepFn(2);
        } else (0, $02ee45712bdfc733$export$ddf018cf7a99d36f)(f.msgError, "All vehicle fields must be filled except message!");
    };
const $b3a133cf85b0ceb6$var$handleSubmitFiles = (f, msgSuccess)=>(e)=>{
        console.log("Form submitted", e.target);
        (0, $02ee45712bdfc733$export$ddf018cf7a99d36f)(f.msgError, "");
        const files = (0, $02ee45712bdfc733$export$7c112ceec8941e67)(f.inputFiles)?.files;
        if (files && files.length > 0) {
            console.log("Files:", files);
            const uploadFiles = (0, $a8cec6fe269f4471$export$7b64c937225679ee)((0, $a8cec6fe269f4471$export$30f6785ef4f50942));
            uploadFiles((0, $a8cec6fe269f4471$export$bc226234bbb4652f)(files)).then((response)=>{
                $b3a133cf85b0ceb6$var$state.form.imageIds = response.map((v)=>v.fileId);
                console.log(`State updated: ${JSON.stringify($b3a133cf85b0ceb6$var$state)}`);
                (0, $a8cec6fe269f4471$export$ad2c850047bf833d)($b3a133cf85b0ceb6$var$state.form).then(()=>{
                    console.log("Success!");
                    (0, $02ee45712bdfc733$export$ddf018cf7a99d36f)(msgSuccess, "Great success!");
                });
            });
        } else if (files && files.length > 10) (0, $02ee45712bdfc733$export$ddf018cf7a99d36f)(f.msgError, "Too many files selected!");
        else (0, $02ee45712bdfc733$export$ddf018cf7a99d36f)(f.msgError, "Files must be selected!");
    };
const $b3a133cf85b0ceb6$export$2cd8252107eb640b = (conf)=>{
    console.log("Initializing...", conf);
    (0, $a8cec6fe269f4471$export$7d7650bf4871ff57)().then((client)=>{
        console.log("Client", client);
        (0, $02ee45712bdfc733$export$52987f4b88db0f2)(conf.elements.stepClient.form, $b3a133cf85b0ceb6$var$handleSubmitClient(conf.stepper, conf.elements.stepClient));
        (0, $02ee45712bdfc733$export$52987f4b88db0f2)(conf.elements.stepVehicle.plateNumber.form, $b3a133cf85b0ceb6$var$handleSubmitSearchVehicle(conf.elements.stepVehicle));
        (0, $02ee45712bdfc733$export$52987f4b88db0f2)(conf.elements.stepVehicle.form, $b3a133cf85b0ceb6$var$handleSubmitVehicle(conf.stepper, conf.elements.stepVehicle));
        (0, $02ee45712bdfc733$export$52987f4b88db0f2)(conf.elements.stepFiles.form, $b3a133cf85b0ceb6$var$handleSubmitFiles(conf.elements.stepFiles, conf.elements.msgSuccess));
    });
};


export {$b3a133cf85b0ceb6$export$2cd8252107eb640b as init};
//# sourceMappingURL=module.js.map
