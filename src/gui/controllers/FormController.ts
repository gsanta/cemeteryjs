
export abstract class FormController<P> {
    focusProp(propType: P) {};
    getFocusedProp(): P { return null; };
    updateStringProp(value: string) {}
    updateBooleanProp(value: boolean) {};
    updateNumberProp(value: number) {};
    commitProp() {};
    deletItemFromListProp(propType: P, index: number): void {};
    getVal(propType: P) {};
}
