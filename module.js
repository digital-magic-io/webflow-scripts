const $1f0b5237e50658ba$var$lookupCarRegistryUrl = (plateNumber)=>`https://test.carprof.ee/api/v1/cars/mnt/${plateNumber}`;
const $1f0b5237e50658ba$var$clientUrl = "https://test.carprof.ee/api/v1/forms/client";
const $1f0b5237e50658ba$var$fetchTyped = async (url)=>{
    const response = await fetch(url);
    return await response.json();
};
const $1f0b5237e50658ba$export$a716ac162dff6323 = (plateNumber)=>$1f0b5237e50658ba$var$fetchTyped($1f0b5237e50658ba$var$lookupCarRegistryUrl(plateNumber));
const $1f0b5237e50658ba$export$7d7650bf4871ff57 = ()=>$1f0b5237e50658ba$var$fetchTyped($1f0b5237e50658ba$var$clientUrl);
const $1f0b5237e50658ba$export$3e93138bfea324f5 = (client)=>fetch($1f0b5237e50658ba$var$clientUrl, {
        method: "POST",
        body: JSON.stringify(client)
    });


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
*/ const $513ce829a2edcd51$var$handleSubmitClient = (conf)=>(e)=>{
        e.preventDefault();
        const client = {
            formType: "BUYOUT",
            name: (0, $ed94571e78be955b$export$7c112ceec8941e67)(conf.elements.stepClient.txtName)?.value ?? "",
            email: (0, $ed94571e78be955b$export$7c112ceec8941e67)(conf.elements.stepClient.txtEmail)?.value ?? "",
            phoneNumber: (0, $ed94571e78be955b$export$7c112ceec8941e67)(conf.elements.stepClient.txtPhone)?.value ?? "",
            language: "et"
        };
        if (client.name && client.email && client.phoneNumber) (0, $1f0b5237e50658ba$export$3e93138bfea324f5)(client).then((r)=>{
            if (r.status < 299) conf.stepper.nextStepFn(1);
            else throw new Error("Unable to send client data");
        }).catch((error)=>{
            console.error("Client error:", error);
            // TODO: Create utility for it
            (0, $ed94571e78be955b$export$c76514939c3de41d)(conf.elements.stepClient.msgError, "Unable to send client data!");
        });
        else (0, $ed94571e78be955b$export$c76514939c3de41d)(conf.elements.stepClient.msgError, "All fields must be filled!");
    };
const $513ce829a2edcd51$export$2cd8252107eb640b = async (conf)=>{
    console.log("Initializing...");
    (0, $1f0b5237e50658ba$export$7d7650bf4871ff57)().then((client)=>{
        console.log("Client", client);
        (0, $ed94571e78be955b$export$52987f4b88db0f2)(conf.elements.stepClient.form, $513ce829a2edcd51$var$handleSubmitClient(conf));
    });
//dom.setupFormHandler(conf.stepVehicle, handleSubmitSearch(dom))
//dom.setupFormHandler(idFormVehicle, handleSubmitVehicle(dom))
};


export {$513ce829a2edcd51$export$2cd8252107eb640b as init};
//# sourceMappingURL=module.js.map
