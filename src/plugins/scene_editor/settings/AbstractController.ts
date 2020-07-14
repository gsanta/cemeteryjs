import { Registry } from '../../../core/Registry';

export interface PropHandlers {
    onChange?(val: any, context: PropContext,  controller: AbstractController): void;
    onClick?(context: PropContext, controller: AbstractController): void;
    onFocus?(context: PropContext, controller: AbstractController): void;
    onBlur?(context: PropContext, controller: AbstractController): void;
    onGet?(context: PropContext, controller: AbstractController): void;
}


export class PropHandler<T> {
    private context: PropContext<T> = {tempVal: undefined};
    changeHandler: (val:  T, context: PropContext<T>, controller: AbstractController) => void;

    constructor(controller: AbstractController) {

    }

    onChange(val: TemplateStringsArray) {

    }
}

export interface PropContext<T> {
    tempVal: T;
}

export abstract class AbstractController<P = any> {
    focusedPropType: P;
    private handlers: Map<P, PropHandler<any>> = new Map();
    private propHandlers: Map<P, PropHandlers> = new Map();
    private propContexts: Map<P, PropContext> = new Map();

    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    change(prop: P, val: any): void {
        const propHandlers = this.propHandlers.get(prop);
        propHandlers.onChange && propHandlers.onChange(val, this.propContexts.get(prop), this);

    }

    click(prop: P): void {
        const propHandlers = this.propHandlers.get(prop);
        propHandlers.onClick && propHandlers.onClick(this.propContexts.get(prop), this);
    }

    focus(prop: P): void {
        const propHandlers = this.propHandlers.get(prop);
        propHandlers.onFocus && propHandlers.onFocus(this.propContexts.get(prop), this);
    }

    blur(prop: P): void {
        const propHandlers = this.propHandlers.get(prop);
        propHandlers.onBlur && propHandlers.onBlur(this.propContexts.get(prop), this);

    }

    val(prop: P): any {
        const propHandlers = this.propHandlers.get(prop);
        return propHandlers.onGet && propHandlers.onGet(this.propContexts.get(prop), this);
    }

    addPropHandlers<T>(prop: P, propHandlers: PropHandlers) {
        this.propHandlers.set(prop, propHandlers);
        this.propContexts.set(prop, { tempVal: '' })
    }

    createPropHandler<T>(prop: P) {
        this.handlers.set(prop, new PropHandler)
    }
}