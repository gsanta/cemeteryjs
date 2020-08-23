import { Registry } from '../../Registry';
import { UI_Plugin } from '../UI_Plugin';
import { UI_Element } from '../../ui_regions/elements/UI_Element';
import { UI_ListItem } from '../../ui_regions/elements/UI_ListItem';

export enum GlobalControllerProps {
    CloseDialog = 'CloseDialog'
}

export interface PropHandlers {
    onChange?(val: any, context: PropContext<any>,  controller: AbstractController): void;
    onClick?(context: PropContext<any>, controller: AbstractController): void;
    onFocus?(context: PropContext<any>, controller: AbstractController): void;
    onBlur?(context: PropContext<any>, controller: AbstractController): void;
    onGet?(context: PropContext<any>, controller: AbstractController): void;
    onGetValues?(context: PropContext<any>, controller: AbstractController): void;
}

export class PropHandler<T> {
    context: PropContext<T> = new PropContext<T>();
    changeHandler: (val:  T, context: PropContext<T>, element: UI_Element, controller: AbstractController) => void;
    clickHandler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void;
    focusHandler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void;
    blurHandler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void;
    getHandler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void;
    getValuesHandler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => any[];

    mouseOverHandler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void;
    mouseOutHandler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void;

    dndStartHandler: (val: T, context: PropContext<T>, element: UI_Element, controller: AbstractController) => void;
    dndEndHandler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void;

    onChange(handler: (val: T, context: PropContext<any>, element: UI_Element, controller: AbstractController) => void) {
        this.changeHandler = handler;
        return this;
    }

    onClick(handler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void) {
        this.clickHandler = handler;
        return this;
    }

    onFocus(handler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void) {
        this.focusHandler = handler;
        return this;
    }

    onBlur(handler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void) {
        this.blurHandler = handler;
        return this;
    }

    onGet(handler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void) {
        this.getHandler = handler;
        return this;
    }

    onGetValues(handler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => any[]) {
        this.getValuesHandler = handler;
        return this;
    }

    onMouseOver(handler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void) {
        this.mouseOverHandler = handler;
        return this;
    }

    onMouseOut(handler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void) {
        this.mouseOutHandler = handler;
        return this;
    }


    onDndStart(handler: (val: T, context: PropContext<T>, element: UI_Element, controller: AbstractController) => void) {
        this.dndStartHandler = handler;
        return this;
    }

    onDndEnd(handler: (context: PropContext<T>, element: UI_Element, controller: AbstractController) => void) {
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

    getTempVal(): T {
        return this.tempVal;
    }

    clearTempVal(): T {
        const tmpVal = this.tempVal;
        this.tempVal = undefined;
        return tmpVal;
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

                Array.from(this.handlers).forEach((val => val[1].context.clearTempVal()));
            });
    }

    change(prop: P, val: any, element: UI_Element): void {
        const handler = this.handlers.get(prop);
        handler.changeHandler(val, handler.context, element, this);
    }

    click(prop: P, element: UI_Element): void {
        const handler = this.handlers.get(prop);
        handler.clickHandler(handler.context, element, this);
    }

    focus(prop: P, element: UI_Element): void {
        const handler = this.handlers.get(prop);
        handler.focusHandler(handler.context, element, this);
    }

    blur(prop: P, element: UI_Element): void {
        const handler = this.handlers.get(prop);
        handler.blurHandler(handler.context, element, this);
    }

    mouseOver(prop: P, element: UI_Element): void {
        const handler = this.handlers.get(prop);
        handler.blurHandler(handler.context, element, this);
    }

    mouseOut(prop: P, element: UI_Element): void {
        const handler = this.handlers.get(prop);
        handler.blurHandler(handler.context, element, this);
    }

    dndStart(prop: P, element: UI_Element, listItem: string): void {
        const handler = this.handlers.get(prop);
        handler.dndStartHandler(listItem, handler.context, element, this);
    }

    dndEnd(prop: P, uiListItem: UI_ListItem): void {
        const handler = this.handlers.get(prop);
        handler.dndEndHandler(handler.context, uiListItem, this);
    }

    val(prop: P, element: UI_Element): any {
        const handler = this.handlers.get(prop);
        return handler.context.getTempVal() !== undefined ? handler.context.getTempVal() : handler.getHandler(handler.context, element, this);
    }

    values(prop: P, element: UI_Element): any[] {
        const handler = this.handlers.get(prop);
        return handler.getValuesHandler(handler.context, element, this);
    }


    createPropHandler<T>(prop: P | GlobalControllerProps) {
        const propHandler = new PropHandler<T>();
        this.handlers.set(prop, propHandler);
        return propHandler;
    }

    getPropHandler<T>(prop: P | GlobalControllerProps): PropHandler<T> {
        return this.handlers.get(prop);
    }
}