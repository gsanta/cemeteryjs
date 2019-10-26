
export interface FormController<P> {
    focusProp(type: P);
    updateStringProp(value: string);
    updateBooleanProp(value: boolean);
    updateNumberProp(value: number);
    commitProp();
}
