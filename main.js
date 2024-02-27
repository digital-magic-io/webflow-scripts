
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "init", function () { return $46808a7dabd6e18e$export$2cd8252107eb640b; });
const $940a411301273780$var$lookupCarRegistryUrl = (plateNumber)=>`https://test.carprof.ee/api/v1/cars/mnt/${plateNumber}`;
const $940a411301273780$var$clientUrl = "https://test.carprof.ee/api/v1/forms/client";
const $940a411301273780$var$fetchTyped = async (url)=>{
    const response = await fetch(url);
    return await response.json();
};
const $940a411301273780$export$a716ac162dff6323 = (plateNumber)=>$940a411301273780$var$fetchTyped($940a411301273780$var$lookupCarRegistryUrl(plateNumber));
const $940a411301273780$export$7d7650bf4871ff57 = ()=>$940a411301273780$var$fetchTyped($940a411301273780$var$clientUrl);
const $940a411301273780$export$3e93138bfea324f5 = (client)=>fetch($940a411301273780$var$clientUrl, {
        method: "POST",
        body: JSON.stringify(client)
    });


const $02e46d9ff778ee32$export$d16800b7e59a8051 = (path)=>{
    const el = document.querySelector(path);
    if (el === null) {
        console.error(`Element not found by path: ${path}.`);
        return undefined;
    } else return el;
};
const $02e46d9ff778ee32$export$7c112ceec8941e67 = (path)=>$02e46d9ff778ee32$export$d16800b7e59a8051(path);
const $02e46d9ff778ee32$export$a212451ed6854bb0 = (path, value)=>{
    const input = $02e46d9ff778ee32$export$7c112ceec8941e67(path);
    if (input) input.value = value;
};
const $02e46d9ff778ee32$export$830c804e8d921bba = (path)=>$02e46d9ff778ee32$export$d16800b7e59a8051(path);
const $02e46d9ff778ee32$export$c76514939c3de41d = (path, msg)=>{
    const el = $02e46d9ff778ee32$export$d16800b7e59a8051(path);
    if (el) el.innerHTML = msg;
};
const $02e46d9ff778ee32$export$52987f4b88db0f2 = (path, handler)=>{
    const form = $02e46d9ff778ee32$export$830c804e8d921bba(path);
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
const $02e46d9ff778ee32$export$89a6f6b18f17322b = (path, handler)=>{
    const btn = $02e46d9ff778ee32$export$d16800b7e59a8051(path);
    if (btn) btn.onclick = handler;
    else console.error(`Unable to find button with id "${path}"`);
};


/*
const handleSubmitSearch = (dom: DomUtils) => (e: Event): void => {
  e.preventDefault()
  e.stopPropagation()
  const formData = e.target as HTMLFormElement
  console.log('Form submitted', formData)
  const plateNumber = getInputById(idInputPlateNumber)?.value
  if (plateNumber && plateNumber.length > 0) {
    console.log('Plate number:', plateNumber)
    apiGetCar(plateNumber)
      .then((response) => {
        console.log('Car response:', response)
        setInputById(idVehicleMake, response.mark)
        setInputById(idVehicleModel, response.model)
      })
      .catch((error) => {
        console.error('Car error:', error)
        const errMsg = getElById(idErrorMessage)
        if (errMsg) {
          errMsg.innerHTML = 'Car not found'
        }
      })
  }
}
*/ const $46808a7dabd6e18e$var$handleSubmitClient = (conf)=>(e)=>{
        e.preventDefault();
        const client = {
            formType: "BUYOUT",
            name: (0, $02e46d9ff778ee32$export$7c112ceec8941e67)(conf.elements.stepClient.txtName)?.value ?? "",
            email: (0, $02e46d9ff778ee32$export$7c112ceec8941e67)(conf.elements.stepClient.txtEmail)?.value ?? "",
            phoneNumber: (0, $02e46d9ff778ee32$export$7c112ceec8941e67)(conf.elements.stepClient.txtPhone)?.value ?? "",
            language: "et"
        };
        if (client.name && client.email && client.phoneNumber) (0, $940a411301273780$export$3e93138bfea324f5)(client).then((r)=>{
            if (r.status < 299) conf.stepper.nextStepFn(1);
            else throw new Error("Unable to send client data");
        }).catch((error)=>{
            console.error("Client error:", error);
            // TODO: Create utility for it
            (0, $02e46d9ff778ee32$export$c76514939c3de41d)(conf.elements.stepClient.msgError, "Unable to send client data!");
        });
        else (0, $02e46d9ff778ee32$export$c76514939c3de41d)(conf.elements.stepClient.msgError, "All fields must be filled!");
    };
const $46808a7dabd6e18e$export$2cd8252107eb640b = async (conf)=>{
    console.log("Initializing...");
    (0, $940a411301273780$export$7d7650bf4871ff57)().then((client)=>{
        console.log("Client", client);
        (0, $02e46d9ff778ee32$export$52987f4b88db0f2)(conf.elements.stepClient.form, $46808a7dabd6e18e$var$handleSubmitClient(conf));
    });
//dom.setupFormHandler(conf.stepVehicle, handleSubmitSearch(dom))
//dom.setupFormHandler(idFormVehicle, handleSubmitVehicle(dom))
};


//# sourceMappingURL=main.js.map
