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
type FormHandlers = {
    init?: Handler<DmForm<string>>;
    beforeSubmit?: Handler<DmForm<string>>;
    afterSubmit?: Handler<DmForm<string>>;
};
type ElementConfig = {
    selector: string;
};
type FormConfig<F extends string, B extends string, L extends string> = {
    onSubmit: <T extends Record<string, unknown>>(data: T, ctx: PageContext<F, B, L>, success: Handler<void>, fail: Handler<unknown>) => Promise<void>;
    onSuccess: (ctx: PageContext<F, B, L>) => void;
    onError: <T>(error: T, ctx: PageContext<F, B, L>) => void;
    errorMessages?: Partial<FormErrorMessages>;
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
    handlers?: FormHandlers;
    afterInit?: Handler<PageContext<F, B, L>>;
};
type FormName = 'initial' | 'vehicle' | 'files';
type ButtonName = never;
type LabelName = 'markAndModel' | 'plateNumber';
type CpMessages = {
    internalError: string;
    invalidPhoneError: string;
    invalidEmailError: string;
};
type CpPageContext = PageContext<FormName, ButtonName, LabelName>;
declare global {
    const grecaptcha: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: {
            action: string;
        }) => Promise<string>;
    };
}
type CpActions = Readonly<{
    switchStep: (step: number, ctx: CpPageContext) => void;
}>;
type CpConfig = Readonly<{
    formSelectors: Record<FormName, string>;
    buttonSelectors: Record<ButtonName, string>;
    labelSelectors: Record<LabelName, string>;
    messages: CpMessages;
    actions: CpActions;
    captchaKey?: string;
}> & Pick<Config<FormName, ButtonName, LabelName>, 'errorMessages' | 'handlers'>;
export const initCp: (conf: CpConfig) => void;

//# sourceMappingURL=types.d.ts.map
