import { Registry } from '../../../core/Registry';


export abstract class AbstractController<P = any> {
    protected tempVal: any;
    focusedPropType: P;
    private clickHandlers: Map<P, (controller: AbstractController) => void>;
    private changeHandlers: Map<P, (val: any, controller: AbstractController) => void>;
    private propGetters: Map<P, (controller: AbstractController) => any>;

    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    change(prop: P, val: any): void {
        this.changeHandlers.get(prop)(this, val);
    }

    click(prop: P): void {
        this.clickHandlers.get(prop)(this);
    }

    onClick(prop: P, handler: (controller: AbstractController) => void) {
        this.clickHandlers.set(prop, handler);
    }

    onChange(prop: P, handler: (val: any, controller: AbstractController) => void) {
        this.changeHandlers.set(prop, handler);
    }

    onGetValue(prop: P, handler: (controller: AbstractController, ) => any) {
        this.propGetters.set(prop, handler);
    }
}