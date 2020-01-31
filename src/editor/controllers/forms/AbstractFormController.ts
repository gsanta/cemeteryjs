import { EventDispatcher } from "../events/EventDispatcher";

export abstract class AbstractFormController<P> {
    protected renderFunc = () => null;
    protected tempString: string;
    protected tempBoolean: boolean;
    protected tempNumber: number;
    protected tempVal: any;
    focusedPropType: P;

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }

    focusProp(propType: P) {
        this.tempVal = this.getProp(propType);
        this.focusedPropType = propType;

        this.renderFunc();
    }

    updateProp(value: any) {
        this.tempVal = value;
        this.renderFunc();
    }

    commitProp() {
        this.setProp(this.tempVal, this.focusedPropType);
        this.tempVal = null;
        this.focusedPropType = null;
        this.renderFunc();
    }

    getVal<T>(property: P): T {
        const val = this.focusedPropType === property ? this.tempVal : this.getProp(property);
        return val;
    }

    getFocusedProp(): P { return this.focusedPropType; };
    deletItemFromListProp(propType: P, index: number): void {};

    protected abstract getProp(prop: P): any;
    protected abstract setProp(val: any, prop: P): void;
}
