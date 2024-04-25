type FN<T, R> = (value: T) => R;
type Handler<T> = FN<T, void>;
type FailedValidationType = 'required' | 'minlength' | 'maxlength' | 'pattern' | 'min' | 'max';
type Validator = (v: string | number | undefined) => true | FailedValidationType;
type FormErrorMessages = Record<FailedValidationType, string>;
type DmElement<T extends HTMLElement> = {
    el: T;
};
type DmField = DmElement<HTMLElement> & {
    input: DmElement<HTMLInputElement>;
    error: DmElement<HTMLElement>;
    validator: Validator;
    clearError: Handler<void>;
    setError: Handler<string>;
    setInputValue: Handler<string>;
};
type DmForm<T extends string> = DmElement<HTMLElement> & {
    fields: Record<T, DmField>;
    error: DmElement<HTMLElement>;
    clearError: Handler<void>;
    clearAllErrors: Handler<void>;
    setError: Handler<string>;
    getFormValues: FN<void, Record<T, string>>;
    setFormValues: Handler<Record<T, string>>;
    resetForm: Handler<void>;
    setFormDisabled: Handler<boolean>;
    setOnSubmit: FN<FN<Event, Promise<void>>, void>;
};
type PageContext<T extends string> = {
    forms: Record<T, DmForm<string>>;
    resetAll: Handler<void>;
};
type FormConfigHandlers = {
    beforeSubmit?: Handler<DmForm<string>>;
    afterSubmit?: Handler<DmForm<string>>;
};
type FormConfig<T extends string> = {
    selector: string;
    onSubmit: (data: Record<string, unknown>, ctx: PageContext<T>, success: Handler<void>, fail: Handler<unknown>) => Promise<void>;
    onSuccess: (ctx: PageContext<T>) => void;
    onError: (error: unknown, ctx: PageContext<T>) => void;
    errorMessages?: FormErrorMessages;
};
type ButtonConfig<T extends string> = {
    selector: string;
    onClick: (ctx: PageContext<T>) => void;
};
type Config<F extends string, B extends string> = {
    forms?: Record<F, FormConfig<F>>;
    buttons?: Record<B, ButtonConfig<F>>;
    errorMessages?: FormErrorMessages;
    handlers?: FormConfigHandlers;
};
export const apiGet: <T>(url: string) => Promise<T>;
export const apiPost: <T, R>(url: string, body: T) => Promise<R>;
export const apiUploadFileList: <R>(url: string, files: FileList) => Promise<R[]>;
export const init: <F extends string, B extends string>(conf: Config<F, B>) => void;

//# sourceMappingURL=types.d.ts.map
