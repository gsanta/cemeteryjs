import { Registry } from '../../Registry';
import { UI_Element } from '../../ui_components/elements/UI_Element';
import { UI_ListItem } from '../../ui_components/elements/UI_ListItem';
import { UI_Panel } from '../UI_Panel';

export enum GlobalControllerProps {
    CloseDialog = 'CloseDialog'
}

export enum InputParamType {
    TextField = 'TextField',
    NumberField = 'NumberField',
    List = 'List',
    MultiSelect = 'MultiList',
    Checkbox = 'Checkbox'
}

export abstract class PropController<T = any> {
    paramType: InputParamType;
    protected context: PropContext;
    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.context = new PropContext(registry);
    }

    acceptedProps(context: PropContext, element: UI_Element): string[] { return []; }

    change?(val: T, context: PropContext<any>, element: UI_Element) {}
    click?(context: PropContext<T>, element: UI_Element) {}
    focus?(context: PropContext<T>, element: UI_Element) {}
    blur?(context: PropContext<T>, element: UI_Element) {}
    defaultVal?(context: PropContext<T>, element: UI_Element) {}
    values?(context: PropContext<T>, element: UI_Element): T[] { return []; }
    val(): T { return undefined; }
    selectedValues?(element: UI_Element): T[] { return []; }
}

export abstract class MultiSelectController extends PropController {
    protected tempVal: string[];
    paramType = InputParamType.MultiSelect;
    isPopupOpen: boolean = false;

    open() {}
    done() {}
    cancel() {}
    select(val: string) {}
    remove(val: string) {}
}

export abstract class DragAndDropController extends PropController {
    abstract onDndStart(dropId: string);
    abstract onDndEnd();
}

export abstract class ParamControllers {
    [id: string] : PropController;
}

export class PropContext<T = any> {
    private tempVal: T;
    registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

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

    param: ParamControllers;

    constructor(panel: UI_Panel, registry: Registry, propControls: PropController<any>[], paramControllers?: ParamControllers) {
        this.panel = <UI_Panel> panel;
        this.registry = registry;
        this.param = paramControllers;

        this.registerPropControl(new CloseDialogController(this.registry));

        if (propControls) {
            propControls.forEach(propControl => {
                this.registerPropControl(propControl);
            });
        }

        if (paramControllers) {
            Object.entries(this.param).forEach(entry => this.registerPropControl(entry[1]));
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
        console.log('clicking: ' + element.key)
        if (controller) {
            console.log('has contorller')

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

    // dndStart(element: UI_Element, listItem: string): void {
    //     const controller = this.findController(element); 

    //     if (controller) {
    //         this.findController(element).onDndStart(this.propContexts.get(controller), element);
    //     }
    // }

    // dndEnd(element: UI_ListItem): void {
    //     const controller = this.findController(element); 
    //     if (controller) {
    //         controller.onDndEnd(this.propContexts.get(controller), element);
    //     }
    // }

    val(element: UI_Element): any {
        const controller = this.findController(element);
        if (controller) {
            const context = this.propContexts.get(controller);
            
            const tmpVal = context.getTempVal();
    
            return tmpVal !== undefined ? tmpVal : controller?.defaultVal(this.propContexts.get(controller), element);
        }
    }

    values(element: UI_Element): any[] {
        const controller = this.findController(element);
        if (controller) {
            const propContext = this.propContexts.get(controller);
            return controller?.values(propContext, element);
        }

        return [];
    }

    selectedValues(element: UI_Element): any[] {
        const controller = this.findController(element);
        if (controller) {
            return controller?.selectedValues(element);
        }

        return [];
    }

    private findController(element: UI_Element): PropController {
        return this.propControllers.find(controller => controller.acceptedProps(this.propContexts.get(controller), element).includes(element.key));
    }

    registerPropControl(propController: PropController<any>) {
        const propContext = new PropContext(this.registry);

        this.propContexts.set(propController, propContext);
        this.propControllers.push(propController);
    }

    static parseFloat(floatVal: string): number {
        try {
            return parseFloat(floatVal);
        } catch(e) {
            console.log(e);
        }
    }
}

class CloseDialogController extends PropController {
    acceptedProps() { return [GlobalControllerProps.CloseDialog]; }

    click(context: PropContext) {
        context.registry.ui.helper.setDialogPanel(undefined);
        context.registry.services.render.reRenderAll();
    }
}