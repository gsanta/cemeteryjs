import { Registry } from '../../Registry';
import { UI_Plugin } from '../UI_Plugin';
import { UI_Element } from '../../ui_components/elements/UI_Element';
import { UI_ListItem } from '../../ui_components/elements/UI_ListItem';

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

export interface PropControl<T> {
    change?(val: T, context: PropContext<any>, element: UI_Element, controller: AbstractController);
    click?(context: PropContext<T>, element: UI_Element, controller: AbstractController);
    focus?(context: PropContext<T>, element: UI_Element, controller: AbstractController);
    blur?(context: PropContext<T>, element: UI_Element, controller: AbstractController);
    defaultVal?(context: PropContext<T>, element: UI_Element, controller: AbstractController);
    values?(context: PropContext<T>, element: UI_Element, controller: AbstractController);
}

const defaultPropControl: PropControl<any> = {
    change(val: any, context: PropContext<any>, element: UI_Element, controller: AbstractController) {},
    click(context: PropContext<any>, element: UI_Element, controller: AbstractController) {},
    focus(context: PropContext<any>, element: UI_Element, controller: AbstractController) {},
    blur(context: PropContext<any>, element: UI_Element, controller: AbstractController) {},
    defaultVal(context: PropContext<any>, element: UI_Element, controller: AbstractController) {}
}

export class PropContext<T> {
    private tempVal: T;
    element: UI_Element;
    registry: Registry;

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
    private propControls: Map<P, PropControl<any>> = new Map();
    private propContexts: Map<P, PropContext<any>> = new Map();

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

        if (handler) {
            handler.changeHandler(val, handler.context, element, this);
        } else {
            const context = this.propContexts.get(prop);
            this.propControls.get(prop)?.change(val, context, element, this);
        }
    }

    click(prop: P, element: UI_Element): void {
        const handler = this.handlers.get(prop);

        if (handler) {
            handler.clickHandler(handler.context, element, this);
        } else {
            const context = this.propContexts.get(prop);
            this.propControls.get(prop)?.click(context, element, this);
        }
    }

    focus(prop: P, element: UI_Element): void {
        const handler = this.handlers.get(prop);

        if (handler) {
            handler.focusHandler(handler.context, element, this);
        } else {
            const context = this.propContexts.get(prop);
            this.propControls.get(prop)?.focus(context, element, this);
        }
    }

    blur(prop: P, element: UI_Element): void {
        const handler = this.handlers.get(prop);

        if (handler) {
            handler.blurHandler(handler.context, element, this);
        } else {
            const context = this.propContexts.get(prop);
            this.propControls.get(prop)?.blur(context, element, this);
        }
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

        if (handler) {
            if (handler.context.getTempVal() !== undefined) {
                return handler.context.getTempVal();
            } else {
                return handler.getHandler(handler.context, element, this);
            }
        } else {
            const tmpVal = this.propContexts.get(prop)?.getTempVal();
            const context = this.propContexts.get(prop);

            return tmpVal !== undefined ? tmpVal :  this.propControls.get(prop)?.defaultVal(context, element, this);
        }
    }

    values(prop: P, element: UI_Element): any[] {
        const handler = this.handlers.get(prop);

        if (handler) {
            return handler.getValuesHandler(handler.context, element, this);
        } else if (this.propControls.get(prop)) {
            const context = this.propContexts.get(prop);
            return this.propControls.get(prop)?.values(context, element, this);
        }

        return [];
    }


    createPropHandler<T>(prop: P | GlobalControllerProps) {
        const propHandler = new PropHandler<T>();
        this.handlers.set(prop, propHandler);
        return propHandler;
    }

    registerPropControl(prop: P, propControl: PropControl<any>) {
        const context = new PropContext();
        context.registry = this.registry;
        this.propContexts.set(prop, context);
        this.propControls.set(prop, {...defaultPropControl, ...propControl});
    }

    getPropHandler<T>(prop: P | GlobalControllerProps): PropHandler<T> {
        return this.handlers.get(prop);
    }
}