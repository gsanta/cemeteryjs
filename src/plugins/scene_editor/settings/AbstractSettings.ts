import { Concept } from "../../../core/models/concepts/Concept";


export enum PropertyType {
    String = 'String',
    Number = 'Number',
    Boolean = 'Boolean'
}

export abstract class AbstractSettings<P> {
    abstract getName(): string;
    protected renderFunc = () => null;
    protected tempString: string;
    protected tempBoolean: boolean;
    protected tempNumber: number;
    protected tempVal: any;
    focusedPropType: P;

    private propertyTypes:  {[val: string]: PropertyType} = {};

    constructor(propertyTypes:  {[val: string]: PropertyType} = {}) {
        this.propertyTypes = propertyTypes;
    }

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }

    getVal<T>(property: P): T {
        const val = this.focusedPropType === property ? this.tempVal : this.getProp(property);
        return val;
    }

    getFocusedProp(): P { return this.focusedPropType; };
    deletItemFromListProp(propType: P, index: number): void {};

    protected abstract getProp(prop: P): any;
    protected abstract setProp(val: any, prop: P): void;

    updateProp(value: any, propType: P) {
        this.setProp(value, propType);
        this.tempVal = null;
        this.focusedPropType = null;
        this.renderFunc();
    }

    blurProp() {
        this.setProp(this.tempVal, this.focusedPropType);
        this.tempVal = null;
        this.focusedPropType = null;
        this.renderFunc();
    }

    focusProp(propType: P) {
        this.tempVal = this.getProp(propType);
        this.focusedPropType = propType;

        this.renderFunc();
    }

    updateFocusedProp(value: any) {
        this.tempVal = value;
        this.renderFunc();
    }

    protected convertValue(val: string, prop: P, defaultVal: any) {
        const propertyType = this.propertyTypes[prop as any] || PropertyType.String;

        switch (propertyType) {
            case PropertyType.Number:
                try { 
                    return val == "" ? 0 : parseFloat(val);
                } catch (e) {
                    return defaultVal;
                }
            default:
                return val;
        }
    }
}

export abstract class ViewSettings<P, V extends Concept> extends AbstractSettings<P> {
    view: V;
}