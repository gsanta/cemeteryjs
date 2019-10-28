
export interface FormController<P> {
    focusProp(propType: P);
    updateStringProp(value: string);
    updateBooleanProp(value: boolean);
    updateNumberProp(value: number);
    commitProp();
    deletItemFromListProp(propType: P, index: number): void;
}
