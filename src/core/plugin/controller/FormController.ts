import { Registry } from '../../Registry';
import { UI_Plugin } from '../UI_Plugin';
import { UI_Element } from '../../ui_components/elements/UI_Element';
import { UI_ListItem } from '../../ui_components/elements/UI_ListItem';
import { UI_Controller } from './UI_Controller';
import { Point } from '../../../utils/geometry/shapes/Point';

export enum GlobalControllerProps {
    CloseDialog = 'CloseDialog'
}

export interface PropHandlers {
    onChange?(val: any, context: PropContext<any>,  controller: FormController): void;
    onClick?(context: PropContext<any>, controller: FormController): void;
    onFocus?(context: PropContext<any>, controller: FormController): void;
    onBlur?(context: PropContext<any>, controller: FormController): void;
    onGet?(context: PropContext<any>, controller: FormController): void;
    onGetValues?(context: PropContext<any>, controller: FormController): void;
}

export class PropHandler<T> {
    context: PropContext<T> = new PropContext<T>();
    changeHandler: (val:  T, context: PropContext<T>, element: UI_Element, controller: FormController) => void;
    clickHandler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void;
    focusHandler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void;
    blurHandler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void;
    getHandler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void;
    getValuesHandler: (context: PropContext<T>, element: UI_Element, controller: FormController) => any[];

    mouseOverHandler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void;
    mouseOutHandler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void;

    dndStartHandler: (val: T, context: PropContext<T>, element: UI_Element, controller: FormController) => void;
    dndEndHandler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void;

    onChange(handler: (val: T, context: PropContext<any>, element: UI_Element, controller: FormController) => void) {
        this.changeHandler = handler;
        return this;
    }

    onClick(handler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void) {
        this.clickHandler = handler;
        return this;
    }

    onFocus(handler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void) {
        this.focusHandler = handler;
        return this;
    }

    onBlur(handler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void) {
        this.blurHandler = handler;
        return this;
    }

    onGet(handler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void) {
        this.getHandler = handler;
        return this;
    }

    onGetValues(handler: (context: PropContext<T>, element: UI_Element, controller: FormController) => any[]) {
        this.getValuesHandler = handler;
        return this;
    }

    onMouseOver(handler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void) {
        this.mouseOverHandler = handler;
        return this;
    }

    onMouseOut(handler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void) {
        this.mouseOutHandler = handler;
        return this;
    }


    onDndStart(handler: (val: T, context: PropContext<T>, element: UI_Element, controller: FormController) => void) {
        this.dndStartHandler = handler;
        return this;
    }

    onDndEnd(handler: (context: PropContext<T>, element: UI_Element, controller: FormController) => void) {
        this.dndEndHandler = handler;
        return this;
    }
}

export abstract class PropController<T = any> {
    prop?: string;

    // TODO: when all uses of PropControl as an interface is eliminated, make prop mandatory
    constructor(prop?: string) {
        this.prop = prop;
    }

    change?(val: T, context: PropContext<any>, element: UI_Element, controller: FormController) {}
    click?(context: PropContext<T>, element: UI_Element, controller: FormController) {}
    focus?(context: PropContext<T>, element: UI_Element, controller: FormController) {}
    blur?(context: PropContext<T>, element: UI_Element, controller: FormController) {}
    defaultVal?(context: PropContext<T>, element: UI_Element, controller: FormController) {}
    values?(context: PropContext<T>, element: UI_Element, controller: FormController): T[] { return []; }

    onDndStart(val: T, context: PropContext<T>, element: UI_Element, controller: FormController) {}
    onDndEnd(context: PropContext<T>, element: UI_Element, controller: FormController) {}
}

const defaultPropControl: PropController<any> = {
    change(val: any, context: PropContext<any>, element: UI_Element, controller: FormController) {},
    click(context: PropContext<any>, element: UI_Element, controller: FormController) {},
    focus(context: PropContext<any>, element: UI_Element, controller: FormController) {},
    blur(context: PropContext<any>, element: UI_Element, controller: FormController) {},
    defaultVal(context: PropContext<any>, element: UI_Element, controller: FormController) {},
    onDndStart(val: any, context: PropContext, element: UI_Element, controller: FormController) {},
    onDndEnd(context: PropContext<any>, element: UI_Element, controller: FormController) {}
}

export class PropContext<T = any> {
    private tempVal: T;
    element: UI_Element;
    registry: Registry;
    plugin: UI_Plugin;
    controller: FormController;

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

export class FormController {
    private handlers: Map<string, PropHandler<any>> = new Map();
    private propControls: Map<string, PropController<any>> = new Map();
    private propContexts: Map<string, PropContext<any>> = new Map();

    protected registry: Registry;
    plugin: UI_Plugin;

    constructor(plugin: UI_Plugin, registry: Registry, propControls?: PropController<any>[]) {
        this.plugin = plugin;
        this.registry = registry;

        this.createPropHandler(GlobalControllerProps.CloseDialog)
            .onClick(() => {
                registry.plugins.deactivatePlugin(plugin.id);
                registry.services.render.reRenderAll();

                Array.from(this.handlers).forEach((val => val[1].context.clearTempVal()));
            });

        if (propControls) {
            propControls.forEach(propControl => {
                this.registerPropControlNew(propControl);
            });
        }
    }

    change(val: any, element: UI_Element): void {
        const handler = this.handlers.get(element.prop);

        if (handler) {
            handler.changeHandler(val, handler.context, element, this);
        } else {
            const context = this.propContexts.get(element.prop);
            this.propControls.get(element.prop)?.change(val, context, element, this);
        }
    }

    click(element: UI_Element): void {
        const handler = this.handlers.get(element.prop);

        if (handler) {
            handler.clickHandler(handler.context, element, this);
        } else {
            const context = this.propContexts.get(element.prop);
            this.propControls.get(element.prop)?.click(context, element, this);
        }
    }

    focus(element: UI_Element): void {
        const handler = this.handlers.get(element.prop);

        if (handler) {
            handler.focusHandler(handler.context, element, this);
        } else {
            const context = this.propContexts.get(element.prop);
            this.propControls.get(element.prop)?.focus(context, element, this);
        }
    }
    blur(element: UI_Element): void {
        const handler = this.handlers.get(element.prop);

        if (handler) {
            handler.blurHandler(handler.context, element, this);
        } else {
            const context = this.propContexts.get(element.prop);
            this.propControls.get(element.prop)?.blur(context, element, this);
        }
    }

    mouseOver(element: UI_Element): void {
        const handler = this.handlers.get(element.prop);
        handler.blurHandler(handler.context, element, this);
    }

    mouseOut(element: UI_Element): void {
        const handler = this.handlers.get(element.prop);
        handler.blurHandler(handler.context, element, this);
    }

    dndStart(element: UI_Element, listItem: string): void {
        const handler = this.handlers.get(element.prop);
        handler.dndStartHandler(listItem, handler.context, element, this);
    }

    dndEnd(uiListItem: UI_ListItem): void {
        const handler = this.handlers.get(uiListItem.prop);
        handler.dndEndHandler(handler.context, uiListItem, this);
    }

    val(element: UI_Element): any {
        const handler = this.handlers.get(element.prop);

        if (handler) {
            if (handler.context.getTempVal() !== undefined) {
                return handler.context.getTempVal();
            } else {
                return handler.getHandler(handler.context, element, this);
            }
        } else {
            const tmpVal = this.propContexts.get(element.prop)?.getTempVal();
            const context = this.propContexts.get(element.prop);

            return tmpVal !== undefined ? tmpVal :  this.propControls.get(element.prop)?.defaultVal(context, element, this);
        }
    }

    values(element: UI_Element): any[] {
        const handler = this.handlers.get(element.prop);

        if (handler) {
            return handler.getValuesHandler(handler.context, element, this);
        } else if (this.propControls.get(element.prop)) {
            const context = this.propContexts.get(element.prop);
            return this.propControls.get(element.prop)?.values(context, element, this);
        }

        return [];
    }


    createPropHandler<T>(prop: string) {
        const propHandler = new PropHandler<T>();
        this.handlers.set(prop, propHandler);
        return propHandler;
    }

    registerPropControl(prop: string, propControl: PropController<any>) {
        const context = new PropContext();
        context.controller = this;
        context.registry = this.registry;
        context.plugin = this.plugin;
        this.propContexts.set(prop, context);
        this.propControls.set(prop, propControl);
    }

    // TODO: it should replace registerPropControl when all off the PropControls will contain the `prop`
    registerPropControlNew(propControl: PropController<any>) {
        const context = new PropContext();
        context.controller = this;
        context.registry = this.registry;
        context.plugin = this.plugin;
        this.propContexts.set(propControl.prop, context);
        this.propControls.set(propControl.prop, propControl);
    }

    getPropContext<T>(prop: string): PropContext<T> {
        return this.propContexts.get(prop);
    }

    getPropHandler<T>(prop: string): PropHandler<T> {
        return this.handlers.get(prop);
    }
}