import { Registry } from '../../Registry';
import { UI_Plugin } from '../UI_Plugin';
import { UI_Element } from '../../ui_regions/elements/UI_Element';

export enum GlobalControllerProps {
    CloseDialog = 'CloseDialog'
}

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

    dndStartHandler: (context: PropContext<T>, controller: AbstractController) => void;
    dndEndHandler: (context: PropContext<T>, controller: AbstractController) => void;

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


    onDndStart(handler: (context: PropContext<T>, controller: AbstractController) => void) {
        this.dndStartHandler = handler;
        return this;
    }

    onDndEnd(handler: (context: PropContext<T>, controller: AbstractController) => void) {
        this.dndEndHandler = handler;
        return this;
    }
}

export class PropContext<T> {
    private tempVal: T;
    element: UI_Element;

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
    private handlers: Map<P | GlobalControllerProps, PropHandler<any>> = new Map();

    protected registry: Registry;
    plugin: UI_Plugin;

    constructor(plugin: UI_Plugin, registry: Registry) {
        this.plugin = plugin;
        this.registry = registry;

        this.createPropHandler(GlobalControllerProps.CloseDialog)
            .onClick(() => {
                registry.plugins.deactivatePlugin(plugin.id);
                registry.services.render.reRenderAll();
            });
    }

    change(prop: P, val: any): void {
        const handler = this.handlers.get(prop);
        handler.changeHandler(val, handler.context, this);
    }

    click(prop: P, element: UI_Element): void {
        const handler = this.handlers.get(prop);
        handler.context.element = element;
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

    dndStart(prop: P): void {
        const handler = this.handlers.get(prop);
        handler.dndStartHandler(handler.context, this);
    }

    dndEnd(prop: P): void {
        const handler = this.handlers.get(prop);
        handler.dndEndHandler(handler.context, this);
    }

    val(prop: P): any {
        const handler = this.handlers.get(prop);
        return handler.getHandler(handler.context, this);
    }

    createPropHandler<T>(prop: P | GlobalControllerProps) {
        const propHandler = new PropHandler<T>();
        this.handlers.set(prop, propHandler);
        return propHandler;
    }
}