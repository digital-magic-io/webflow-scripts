// Application entry point
const $513ce829a2edcd51$var$getCarUrl = (plateNumber)=>`https://test.carprof.ee/api/v1/cars/mnt/${plateNumber}`;
const $513ce829a2edcd51$var$idErrorMessage = "error-message";
const $513ce829a2edcd51$var$idFormSearch = "search-form";
const $513ce829a2edcd51$var$idInputPlateNumber = "plateNumber";
const $513ce829a2edcd51$var$idFormVehicle = "vehicle-form";
const $513ce829a2edcd51$var$idVehicleMake = "make";
const $513ce829a2edcd51$var$idVehicleModel = "model";
const $513ce829a2edcd51$var$getElById = (id)=>{
    const el = document.getElementById(id);
    if (el === null) {
        console.error(`Element with id "${id}" not found`);
        return undefined;
    } else return el;
};
const $513ce829a2edcd51$var$getInputById = (id)=>$513ce829a2edcd51$var$getElById(id);
const $513ce829a2edcd51$var$setInputById = (id, value)=>{
    const input = $513ce829a2edcd51$var$getInputById(id);
    if (input) input.value = value;
};
const $513ce829a2edcd51$var$getFormById = (id)=>$513ce829a2edcd51$var$getElById(id);
const $513ce829a2edcd51$var$fetchTyped = async (url)=>{
    const response = await fetch(url);
    return await response.json();
};
const $513ce829a2edcd51$var$setupFormHandler = (formId, handler)=>{
    const form = $513ce829a2edcd51$var$getFormById(formId);
    if (form) {
        form.action = "";
        form.method = "";
        form.addEventListener("submit", handler);
    } else console.error(`Unable to find form with id "${$513ce829a2edcd51$var$idFormSearch}"`);
};
const $513ce829a2edcd51$var$apiGetCar = (plateNumber)=>$513ce829a2edcd51$var$fetchTyped($513ce829a2edcd51$var$getCarUrl(plateNumber));
const $513ce829a2edcd51$var$handleSubmitSearch = (e)=>{
    e.preventDefault();
    const formData = e.target;
    console.log("Form submitted", formData);
    const plateNumber = $513ce829a2edcd51$var$getInputById($513ce829a2edcd51$var$idInputPlateNumber)?.value;
    if (plateNumber && plateNumber.length > 0) {
        console.log("Plate number:", plateNumber);
        $513ce829a2edcd51$var$apiGetCar(plateNumber).then((response)=>{
            console.log("Car response:", response);
            $513ce829a2edcd51$var$setInputById($513ce829a2edcd51$var$idVehicleMake, response.mark);
            $513ce829a2edcd51$var$setInputById($513ce829a2edcd51$var$idVehicleModel, response.model);
        }).catch((error)=>{
            console.error("Car error:", error);
            const errMsg = $513ce829a2edcd51$var$getElById($513ce829a2edcd51$var$idErrorMessage);
            if (errMsg) errMsg.innerHTML = "Car not found";
        });
    }
};
const $513ce829a2edcd51$var$handleSubmitVehicle = (e)=>{
    e.preventDefault();
    const formData = e.target;
    console.log("Form submitted", formData);
};
const $513ce829a2edcd51$export$2cd8252107eb640b = ()=>{
    $513ce829a2edcd51$var$setupFormHandler($513ce829a2edcd51$var$idFormSearch, $513ce829a2edcd51$var$handleSubmitSearch);
    $513ce829a2edcd51$var$setupFormHandler($513ce829a2edcd51$var$idFormVehicle, $513ce829a2edcd51$var$handleSubmitVehicle);
};
$513ce829a2edcd51$export$2cd8252107eb640b();


export {$513ce829a2edcd51$export$2cd8252107eb640b as init};
//# sourceMappingURL=module.js.map
