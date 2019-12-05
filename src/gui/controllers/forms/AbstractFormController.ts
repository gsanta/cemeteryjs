
export abstract class AbstractFormController<P> {
    protected renderFunc = () => null;
    protected tempString: string;
    protected tempBoolean: boolean;
    protected tempNumber: number;
    focusedPropType: P;

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }

    focusProp(propType: P) {};
    getFocusedProp(): P { return this.focusedPropType; };
    updateStringProp(value: string) {}
    updateBooleanProp(value: boolean) {};
    updateNumberProp(value: number) {};
    commitProp(removeFocus?: boolean) {};
    deletItemFromListProp(propType: P, index: number): void {};
    getVal(propType: P) {};
}
