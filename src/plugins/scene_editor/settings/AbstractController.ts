import { Registry } from '../../../core/Registry';
import { UI_Plugin } from '../../../core/UI_Plugin';

export interface PropHandlers {
    onChange?(val: any, context: PropContext<any>,  controller: AbstractController): void;
    onClick?(context: PropContext<any>, controller: AbstractController): void;
    onFocus?(context: PropContext<any>, controller: AbstractController): void;
    onBlur?(context: PropContext<any>, controller: AbstractController): void;
    onGet?(context: PropContext<any>, controller: AbstractController): void;
}

export class PropHandler<T> {
    context: PropContext<T> = new PropContext<T>();
    changeHandler: (val:  T, context: PropContext<T>, controller: AbstractController) => void;
    clickHandler: (context: PropContext<T>, controller: AbstractController) => void;
    focusHandler: (context: PropContext<T>, controller: AbstractController) => void;
    blurHandler: (context: PropContext<T>, controller: AbstractController) => void;
    getHandler: (context: PropContext<T>, controller: AbstractController) => void;

    mouseOverHandler: (context: PropContext<T>, controller: AbstractController) => void;
    mouseOutHandler: (context: PropContext<T>, controller: AbstractController) => void;

    onChange(handler: (val: T, context: PropContext<any>,  controller: AbstractController) => void) {
        this.changeHandler = handler;
        return this;
    }

    onClick(handler: (context: PropContext<T>, controller: AbstractController) => void) {
        this.clickHandler = handler;
        return this;
    }

    onFocus(handler: (context: PropContext<T>, controller: AbstractController) => void) {
        this.focusHandler = handler;
        return this;
    }

    onBlur(handler: (context: PropContext<T>, controller: AbstractController) => void) {
        this.blurHandler = handler;
        return this;
    }

    onGet(handler: (context: PropContext<T>, controller: AbstractController) => void) {
        this.getHandler = handler;
        return this;
    }

    onMouseOver(handler: (context: PropContext<T>, controller: AbstractController) => void) {
        this.mouseOverHandler = handler;
        return this;
    }

    onMouseOut(handler: (context: PropContext<T>, controller: AbstractController) => void) {
        this.mouseOutHandler = handler;
        return this;
    }
}

export class PropContext<T> {
    private tempVal: T;

    updateTempVal(val: T) {
        this.tempVal = val;
    }

    getTempVal(origVal: () => T): T {
        return this.tempVal ? this.tempVal : origVal();
    }

    releaseTempVal(callback: (val: T) => void) {
        callback(this.tempVal);
        this.tempVal = undefined;
    }
}

export abstract class AbstractController<P = any> {
    id: string;
    private handlers: Map<P, PropHandler<any>> = new Map();

    protected registry: Registry;
    plugin: UI_Plugin;

    constructor(plugin: UI_Plugin, registry: Registry) {
        this.plugin = plugin;
        this.registry = registry;
    }

    change(prop: P, val: any): void {
        const handler = this.handlers.get(prop);
        handler.changeHandler(val, handler.context, this);
    }

    click(prop: P): void {
        const handler = this.handlers.get(prop);
        handler.clickHandler(handler.context, this);
    }

    focus(prop: P): void {
        const handler = this.handlers.get(prop);
        handler.focusHandler(handler.context, this);
    }

    blur(prop: P): void {
        const handler = this.handlers.get(prop);
        handler.blurHandler(handler.context, this);
    }

    mouseOver(prop: P): void {
        const handler = this.handlers.get(prop);
        handler.blurHandler(handler.context, this);
    }

    mouseOut(prop: P): void {
        const handler = this.handlers.get(prop);
        handler.blurHandler(handler.context, this);
    }

    val(prop: P): any {
        const handler = this.handlers.get(prop);
        return handler.getHandler(handler.context, this);
    }

    createPropHandler<T>(prop: P) {
        const propHandler = new PropHandler<T>();
        this.handlers.set(prop, propHandler);
        return propHandler;
    }
}