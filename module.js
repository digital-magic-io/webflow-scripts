const $1f0b5237e50658ba$var$lookupCarRegistryUrl = (plateNumber)=>`https://test.carprof.ee/api/v1/cars/mnt/${plateNumber}`;
const $1f0b5237e50658ba$var$clientUrl = "https://test.carprof.ee/api/v1/forms/client";
const $1f0b5237e50658ba$var$fetchTyped = async (url, init = {
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
const $1f0b5237e50658ba$var$getTyped = async (url)=>$1f0b5237e50658ba$var$fetchTyped(url);
const $1f0b5237e50658ba$var$postTyped = async (url, body)=>$1f0b5237e50658ba$var$fetchTyped(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    });
const $1f0b5237e50658ba$export$a716ac162dff6323 = (plateNumber)=>$1f0b5237e50658ba$var$getTyped($1f0b5237e50658ba$var$lookupCarRegistryUrl(plateNumber));
const $1f0b5237e50658ba$export$7d7650bf4871ff57 = ()=>$1f0b5237e50658ba$var$getTyped($1f0b5237e50658ba$var$clientUrl);
const $1f0b5237e50658ba$export$3e93138bfea324f5 = (client)=>$1f0b5237e50658ba$var$postTyped($1f0b5237e50658ba$var$clientUrl, client);


const $ed94571e78be955b$export$d16800b7e59a8051 = (path)=>{
    const el = document.querySelector(path);
    if (el === null) {
        console.error(`Element not found by path: ${path}.`);
        return undefined;
    } else return el;
};
const $ed94571e78be955b$export$7c112ceec8941e67 = (path)=>$ed94571e78be955b$export$d16800b7e59a8051(path);
const $ed94571e78be955b$export$a212451ed6854bb0 = (path, value)=>{
    const input = $ed94571e78be955b$export$7c112ceec8941e67(path);
    if (input) input.value = value;
};
const $ed94571e78be955b$export$830c804e8d921bba = (path)=>$ed94571e78be955b$export$d16800b7e59a8051(path);
const $ed94571e78be955b$export$c76514939c3de41d = (path, msg)=>{
    const el = $ed94571e78be955b$export$d16800b7e59a8051(path);
    if (el) el.innerHTML = msg;
};
const $ed94571e78be955b$export$52987f4b88db0f2 = (path, handler)=>{
    const form = $ed94571e78be955b$export$830c804e8d921bba(path);
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
const $ed94571e78be955b$export$89a6f6b18f17322b = (path, handler)=>{
    const btn = $ed94571e78be955b$export$d16800b7e59a8051(path);
    if (btn) btn.onclick = handler;
    else console.error(`Unable to find button with id "${path}"`);
};


const $513ce829a2edcd51$var$handleSubmitClient = (stepper, f)=>(e)=>{
        console.log("Form submitted", e.target);
        const client = {
            formType: "BUYOUT",
            name: (0, $ed94571e78be955b$export$7c112ceec8941e67)(f.txtName)?.value ?? "",
            email: (0, $ed94571e78be955b$export$7c112ceec8941e67)(f.txtEmail)?.value ?? "",
            phoneNumber: (0, $ed94571e78be955b$export$7c112ceec8941e67)(f.txtPhone)?.value ?? "",
            language: "et"
        };
        if (client.name && client.email && client.phoneNumber) (0, $1f0b5237e50658ba$export$3e93138bfea324f5)(client).then(()=>{
            stepper.nextStepFn(1);
        }).catch((error)=>{
            console.error("API error:", error);
            (0, $ed94571e78be955b$export$c76514939c3de41d)(f.msgError, "Unable to send client data!");
        });
        else (0, $ed94571e78be955b$export$c76514939c3de41d)(f.msgError, "All fields must be filled!");
    };
const $513ce829a2edcd51$var$handleSubmitSearchVehicle = (f)=>(e)=>{
        console.log("Form submitted", e.target);
        const plateNumber = (0, $ed94571e78be955b$export$7c112ceec8941e67)(f.plateNumber.txtPlateNumber)?.value;
        if (plateNumber && plateNumber.length > 0) {
            console.log("Plate number:", plateNumber);
            (0, $1f0b5237e50658ba$export$a716ac162dff6323)(plateNumber).then((response)=>{
                console.log("Car response:", response);
                (0, $ed94571e78be955b$export$a212451ed6854bb0)(f.txtMake, response.mark);
                (0, $ed94571e78be955b$export$a212451ed6854bb0)(f.txtModel, response.model);
            }).catch((error)=>{
                console.error("Car error:", error);
                (0, $ed94571e78be955b$export$c76514939c3de41d)(f.plateNumber.msgError, "Car not found!");
            });
        } else (0, $ed94571e78be955b$export$c76514939c3de41d)(f.plateNumber.msgError, "Plate number must be filled!");
    };
const $513ce829a2edcd51$var$handleSubmitVehicle = (f)=>(e)=>{
        console.log("Form submitted", e.target);
        const make = (0, $ed94571e78be955b$export$7c112ceec8941e67)(f.txtMake)?.value;
        const model = (0, $ed94571e78be955b$export$7c112ceec8941e67)(f.txtModel)?.value;
        if (make && model) console.log(`Submitted: make=${make}, model=${model}`);
        else (0, $ed94571e78be955b$export$c76514939c3de41d)(f.msgError, "Make and model must be filled!");
    };
const $513ce829a2edcd51$export$2cd8252107eb640b = (conf)=>{
    console.log("Initializing...", conf);
    (0, $1f0b5237e50658ba$export$7d7650bf4871ff57)().then((client)=>{
        console.log("Client", client);
        (0, $ed94571e78be955b$export$52987f4b88db0f2)(conf.elements.stepClient.form, $513ce829a2edcd51$var$handleSubmitClient(conf.stepper, conf.elements.stepClient));
        (0, $ed94571e78be955b$export$52987f4b88db0f2)(conf.elements.stepVehicle.plateNumber.form, $513ce829a2edcd51$var$handleSubmitSearchVehicle(conf.elements.stepVehicle));
        (0, $ed94571e78be955b$export$52987f4b88db0f2)(conf.elements.stepVehicle.form, $513ce829a2edcd51$var$handleSubmitVehicle(conf.elements.stepVehicle));
    });
//dom.setupFormHandler(conf.stepVehicle, handleSubmitSearch(dom))
//dom.setupFormHandler(idFormVehicle, handleSubmitVehicle(dom))
};


export {$513ce829a2edcd51$export$2cd8252107eb640b as init};
//# sourceMappingURL=module.js.map
