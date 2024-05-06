type FN<T, R> = (value: T) => R;
type Handler<T> = FN<T, void>;
type FailedValidationType = 'required' | 'minlength' | 'maxlength' | 'pattern' | 'min' | 'max';
type Validator = (v: string | number | undefined) => true | FailedValidationType;
type FormErrorMessages = Record<FailedValidationType, string>;
type DmElement<T extends HTMLElement> = {
    el: T;
};
type DmButton = DmElement<HTMLButtonElement> & {
    setLabel: Handler<string>;
    setDisabled: Handler<boolean>;
};
type DmLabel = DmElement<HTMLElement> & {
    setLabel: Handler<string>;
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
type PageContext<F extends string, B extends string, L extends string> = {
    buttons: Record<B, DmButton>;
    labels: Record<L, DmLabel>;
    forms: Record<F, DmForm<string>>;
    resetAll: Handler<void>;
};
type FormConfigHandlers = {
    beforeSubmit?: Handler<DmForm<string>>;
    afterSubmit?: Handler<DmForm<string>>;
};
type ElementConfig = {
    selector: string;
};
type FormConfig<F extends string, B extends string, L extends string> = {
    onSubmit: (data: Record<string, unknown>, ctx: PageContext<F, B, L>, success: Handler<void>, fail: Handler<unknown>) => Promise<void>;
    onSuccess: (ctx: PageContext<F, B, L>) => void;
    onError: (error: unknown, ctx: PageContext<F, B, L>) => void;
    errorMessages?: FormErrorMessages;
} & ElementConfig;
type ButtonConfig<F extends string, B extends string, L extends string> = {
    onClick: (ctx: PageContext<F, B, L>) => void;
} & ElementConfig;
type LabelConfig = ElementConfig;
type Config<F extends string, B extends string, L extends string> = {
    forms?: Record<F, FormConfig<F, B, L>>;
    buttons?: Record<B, ButtonConfig<F, B, L>>;
    labels?: Record<L, LabelConfig>;
    errorMessages?: FormErrorMessages;
    handlers?: FormConfigHandlers;
};
export class ApiError extends Error {
    readonly status: number;
    readonly url: string;
    readonly method: string;
    readonly cause: string;
    readonly response: Response;
    constructor(response: Response, cause: string);
}
export const apiGetErrorFromResponse: <T>(response: Response) => Promise<T>;
export const apiGet: <T>(url: string) => Promise<T>;
export const apiPost: <T, R>(url: string, body: T) => Promise<R>;
export const apiUploadFileList: <R>(url: string, files: FileList) => Promise<R[]>;
export const init: <F extends string, B extends string, L extends string>(conf: Config<F, B, L>) => void;

//# sourceMappingURL=types.d.ts.map
