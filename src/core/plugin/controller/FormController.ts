import { Registry } from '../../Registry';
import { UI_Element } from '../../ui_components/elements/UI_Element';
import { UI_ListItem } from '../../ui_components/elements/UI_ListItem';
import { UI_Plugin } from '../UI_Plugin';

export enum GlobalControllerProps {
    CloseDialog = 'CloseDialog'
}

export abstract class PropController<T = any> {
    abstract acceptedProps(context: PropContext): string[];

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
    private propControllers: PropController<any>[] = [];
    private propContext: PropContext;

    protected registry: Registry;
    plugin: UI_Plugin;

    constructor(plugin: UI_Plugin, registry: Registry, propControls?: PropController<any>[]) {
        this.plugin = plugin;
        this.registry = registry;

        this.propContext = new PropContext();
        this.propContext.registry = this.registry;
        this.propContext.plugin = this.plugin;

        this.registerPropControl(new CloseDialogController());

        if (propControls) {
            propControls.forEach(propControl => {
                this.registerPropControl(propControl);
            });
        }
    }

    change(val: any, element: UI_Element): void {
        this.findController(element)?.change(val, this.propContext, element);
    }

    click(element: UI_Element): void {
        this.findController(element)?.click(this.propContext, element);
    }

    focus(element: UI_Element): void {
        this.findController(element)?.focus(this.propContext, element);
    }

    blur(element: UI_Element): void {    
        this.findController(element)?.blur(this.propContext, element);
    }

    dndStart(element: UI_Element, listItem: string): void {
        this.findController(element)?.onDndStart(this.propContext, element);
    }

    dndEnd(uiListItem: UI_ListItem): void {
        this.findController(uiListItem)?.onDndEnd(this.propContext, uiListItem);
    }

    val(element: UI_Element): any {
        const tmpVal = this.propContext.getTempVal();

        return tmpVal !== undefined ? tmpVal :  this.findController(element).defaultVal(this.propContext, element);
    }

    values(element: UI_Element): any[] {
        const controller = this.findController(element);
        if (controller) {
            return controller?.values(this.propContext, element);
        }

        return [];
    }

    private findController(element: UI_Element): PropController {
        return this.propControllers.find(controller => controller.acceptedProps(this.propContext).includes(element.prop));
    }

    registerPropControl(propController: PropController<any>) {
        this.propControllers.push(propController);
    }
}

class CloseDialogController extends PropController {
    acceptedProps() { return [GlobalControllerProps.CloseDialog]; }

    click(context: PropContext) {
        context.registry.plugins.deactivatePlugin(context.plugin.id);
        context.registry.services.render.reRenderAll();
    }
}