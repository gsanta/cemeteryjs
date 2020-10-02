import { Registry } from '../../Registry';
import { UI_Element } from '../../ui_components/elements/UI_Element';
import { UI_ListItem } from '../../ui_components/elements/UI_ListItem';
import { UI_Plugin } from '../UI_Plugin';

export enum GlobalControllerProps {
    CloseDialog = 'CloseDialog'
}

export abstract class PropController<T = any> {
    prop?: string;

    // TODO: when all uses of PropControl as an interface is eliminated, make prop mandatory
    constructor(prop?: string) {
        this.prop = prop;
    }

    change?(val: T, context: PropContext<any>, element: UI_Element) {}
    click?(context: PropContext<T>, element: UI_Element) {}
    focus?(context: PropContext<T>, element: UI_Element) {}
    blur?(context: PropContext<T>, element: UI_Element) {}
    defaultVal?(context: PropContext<T>, element: UI_Element) {}
    values?(context: PropContext<T>, element: UI_Element): T[] { return []; }

    onDndStart(context: PropContext<T>, element: UI_Element) {}
    onDndEnd(context: PropContext<T>, element: UI_Element) {}
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
    private propControllers: Map<string, PropController<any>> = new Map();
    private propContexts: Map<string, PropContext<any>> = new Map();

    protected registry: Registry;
    plugin: UI_Plugin;

    constructor(plugin: UI_Plugin, registry: Registry, propControls?: PropController<any>[]) {
        this.plugin = plugin;
        this.registry = registry;

        this.registerPropControl(new CloseDialogController());

        if (propControls) {
            propControls.forEach(propControl => {
                this.registerPropControl(propControl);
            });
        }
    }

    change(val: any, element: UI_Element): void {
        const context = this.propContexts.get(element.prop);
        this.propControllers.get(element.prop)?.change(val, context, element);
    }

    click(element: UI_Element): void {
        const context = this.propContexts.get(element.prop);
        this.propControllers.get(element.prop).click(context, element);
    }

    focus(element: UI_Element): void {
        const context = this.propContexts.get(element.prop);
        this.propControllers.get(element.prop).focus(context, element);
    }

    blur(element: UI_Element): void {    
        const context = this.propContexts.get(element.prop);
        this.propControllers.get(element.prop).blur(context, element);
    }

    dndStart(element: UI_Element, listItem: string): void {
        const context = this.propContexts.get(element.prop);
        this.propControllers.get(element.prop).onDndStart(context, element);
    }

    dndEnd(uiListItem: UI_ListItem): void {
        const context = this.propContexts.get(uiListItem.prop);
        this.propControllers.get(uiListItem.prop).onDndEnd(context, uiListItem);
    }

    val(element: UI_Element): any {
        const tmpVal = this.propContexts.get(element.prop)?.getTempVal();
        const context = this.propContexts.get(element.prop);

        return tmpVal !== undefined ? tmpVal :  this.propControllers.get(element.prop).defaultVal(context, element);
    }

    values(element: UI_Element): any[] {
        if (this.propControllers.get(element.prop)) {
            const context = this.propContexts.get(element.prop);
            return this.propControllers.get(element.prop)?.values(context, element);
        }

        return [];
    }

    registerPropControl(propControl: PropController<any>) {
        const context = new PropContext();
        context.controller = this;
        context.registry = this.registry;
        context.plugin = this.plugin;
        this.propContexts.set(propControl.prop, context);
        this.propControllers.set(propControl.prop, propControl);
    }

    getPropContext<T>(prop: string): PropContext<T> {
        return this.propContexts.get(prop);
    }
}

class CloseDialogController extends PropController {

    constructor() {
        super(GlobalControllerProps.CloseDialog);
    }

    click(context: PropContext) {
        context.registry.plugins.deactivatePlugin(context.plugin.id);
        context.registry.services.render.reRenderAll();
    }
}