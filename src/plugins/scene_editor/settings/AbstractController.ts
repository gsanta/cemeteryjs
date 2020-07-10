import { Registry } from '../../../core/Registry';

export interface PropHandlers {
    onChange?(val: any, controller: AbstractController): void;
    onClick?(controller: AbstractController): void;
    onBlur?(controller: AbstractController): void;
    onGet?(controller: AbstractController): void;
}

export abstract class AbstractController<P = any> {
    protected tempVal: any;
    focusedPropType: P;
    private propHandlers: Map<P, PropHandlers> = new Map();

    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    change(prop: P, val: any): void {
        const propHandlers = this.propHandlers.get(prop);
        propHandlers.onChange && propHandlers.onChange(val, this);

    }

    click(prop: P): void {
        const propHandlers = this.propHandlers.get(prop);
        propHandlers.onClick && propHandlers.onClick(this);
    }

    blur(prop: P): void {
        const propHandlers = this.propHandlers.get(prop);
        propHandlers.onBlur && propHandlers.onBlur(this);

    }

    val(prop: P): any {
        const propHandlers = this.propHandlers.get(prop);
        return propHandlers.onGet && propHandlers.onGet(this);
    }

    addPropHandlers(prop: P, propHandlers: PropHandlers) {
        this.propHandlers.set(prop, propHandlers);
    }
}