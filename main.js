
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "init", function () { return $46808a7dabd6e18e$export$2cd8252107eb640b; });
// Application entry point
const $46808a7dabd6e18e$var$getCarUrl = (plateNumber)=>`https://test.carprof.ee/api/v1/cars/mnt/${plateNumber}`;
const $46808a7dabd6e18e$var$idErrorMessage = "error-message";
const $46808a7dabd6e18e$var$idFormSearch = "search-form";
const $46808a7dabd6e18e$var$idInputPlateNumber = "plateNumber";
const $46808a7dabd6e18e$var$idFormVehicle = "vehicle-form";
const $46808a7dabd6e18e$var$idVehicleMake = "make";
const $46808a7dabd6e18e$var$idVehicleModel = "model";
const $46808a7dabd6e18e$var$getElById = (id)=>{
    const el = document.getElementById(id);
    if (el === null) {
        console.error(`Element with id "${id}" not found`);
        return undefined;
    } else return el;
};
const $46808a7dabd6e18e$var$getInputById = (id)=>$46808a7dabd6e18e$var$getElById(id);
const $46808a7dabd6e18e$var$setInputById = (id, value)=>{
    const input = $46808a7dabd6e18e$var$getInputById(id);
    if (input) input.value = value;
};
const $46808a7dabd6e18e$var$getFormById = (id)=>$46808a7dabd6e18e$var$getElById(id);
const $46808a7dabd6e18e$var$fetchTyped = async (url)=>{
    const response = await fetch(url);
    return await response.json();
};
const $46808a7dabd6e18e$var$setupFormHandler = (formId, handler)=>{
    const form = $46808a7dabd6e18e$var$getFormById(formId);
    if (form) {
        form.action = "";
        form.method = "";
        form.addEventListener("submit", handler);
    } else console.error(`Unable to find form with id "${$46808a7dabd6e18e$var$idFormSearch}"`);
};
const $46808a7dabd6e18e$var$apiGetCar = (plateNumber)=>$46808a7dabd6e18e$var$fetchTyped($46808a7dabd6e18e$var$getCarUrl(plateNumber));
const $46808a7dabd6e18e$var$handleSubmitSearch = (e)=>{
    e.preventDefault();
    const formData = e.target;
    console.log("Form submitted", formData);
    const plateNumber = $46808a7dabd6e18e$var$getInputById($46808a7dabd6e18e$var$idInputPlateNumber)?.value;
    if (plateNumber && plateNumber.length > 0) {
        console.log("Plate number:", plateNumber);
        $46808a7dabd6e18e$var$apiGetCar(plateNumber).then((response)=>{
            console.log("Car response:", response);
            $46808a7dabd6e18e$var$setInputById($46808a7dabd6e18e$var$idVehicleMake, response.mark);
            $46808a7dabd6e18e$var$setInputById($46808a7dabd6e18e$var$idVehicleModel, response.model);
        }).catch((error)=>{
            console.error("Car error:", error);
            const errMsg = $46808a7dabd6e18e$var$getElById($46808a7dabd6e18e$var$idErrorMessage);
            if (errMsg) errMsg.innerHTML = "Car not found";
        });
    }
};
const $46808a7dabd6e18e$var$handleSubmitVehicle = (e)=>{
    e.preventDefault();
    const formData = e.target;
    console.log("Form submitted", formData);
};
const $46808a7dabd6e18e$export$2cd8252107eb640b = ()=>{
    $46808a7dabd6e18e$var$setupFormHandler($46808a7dabd6e18e$var$idFormSearch, $46808a7dabd6e18e$var$handleSubmitSearch);
    $46808a7dabd6e18e$var$setupFormHandler($46808a7dabd6e18e$var$idFormVehicle, $46808a7dabd6e18e$var$handleSubmitVehicle);
};
$46808a7dabd6e18e$export$2cd8252107eb640b();


//# sourceMappingURL=main.js.map
