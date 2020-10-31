import { Registry } from '../../Registry';
import { UI_Element } from '../../ui_components/elements/UI_Element';
import { UI_ListItem } from '../../ui_components/elements/UI_ListItem';
import { UI_Panel } from '../UI_Panel';
import { UI_Plugin } from '../UI_Plugin';

export enum GlobalControllerProps {
    CloseDialog = 'CloseDialog'
}

export abstract class PropController<T = any> {
    abstract acceptedProps(context: PropContext, element: UI_Element): string[];

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
    registry: Registry;
    panel: UI_Panel;
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
    private propContexts: Map<PropController, PropContext> = new Map();

    protected registry: Registry;
    panel: UI_Panel;
    plugin: UI_Plugin;

    constructor(plugin: UI_Panel | UI_Plugin, registry: Registry, propControls?: PropController<any>[]) {
        if ((plugin as any).getPanel) {
            this.plugin = <UI_Plugin> plugin;
            this.panel = this.plugin.getPanel();
        } else {
            this.panel = <UI_Panel> plugin;
        }
        this.registry = registry;

        this.registerPropControl(new CloseDialogController());

        if (propControls) {
            propControls.forEach(propControl => {
                this.registerPropControl(propControl);
            });
        }
    }

    change(val: any, element: UI_Element): void {
        const controller = this.findController(element); 

        if (controller) {        
            controller.change(val, this.propContexts.get(controller), element);
        }
    }

    click(element: UI_Element): void {
        const controller = this.findController(element); 

        if (controller) {
            this.findController(element).click(this.propContexts.get(controller), element);
        }
    }

    focus(element: UI_Element): void {
        const controller = this.findController(element); 

        if (controller) {
            this.findController(element).focus(this.propContexts.get(controller), element);
        }
    }

    blur(element: UI_Element): void {
        const controller = this.findController(element); 

        if (controller) {
            this.findController(element).blur(this.propContexts.get(controller), element);
        }
    }

    dndStart(element: UI_Element, listItem: string): void {
        const controller = this.findController(element); 

        if (controller) {
            this.findController(element).onDndStart(this.propContexts.get(controller), element);
        }
    }

    dndEnd(element: UI_ListItem): void {
        const controller = this.findController(element); 
        if (controller) {
            controller.onDndEnd(this.propContexts.get(controller), element);
        }
    }

    val(element: UI_Element): any {
        const controller = this.findController(element);
        const context = this.propContexts.get(controller);
        const tmpVal = context.getTempVal();

        return tmpVal !== undefined ? tmpVal : controller?.defaultVal(this.propContexts.get(controller), element);
    }

    values(element: UI_Element): any[] {
        const controller = this.findController(element);
        if (controller) {
            const propContext = this.propContexts.get(controller);
            return controller?.values(propContext, element);
        }

        return [];
    }

    private findController(element: UI_Element): PropController {
        return this.propControllers.find(controller => controller.acceptedProps(this.propContexts.get(controller), element).includes(element.prop));
    }

    registerPropControl(propController: PropController<any>) {
        const propContext = new PropContext();
        propContext.registry = this.registry;
        propContext.panel = this.panel;
        propContext.plugin = this.plugin;

        this.propContexts.set(propController, propContext);
        this.propControllers.push(propController);
    }
}

class CloseDialogController extends PropController {
    acceptedProps() { return [GlobalControllerProps.CloseDialog]; }

    click(context: PropContext) {
        context.registry.plugins.deactivatePlugin(context.panel.id);
        context.registry.services.render.reRenderAll();
    }
}