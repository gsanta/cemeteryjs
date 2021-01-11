import { Registry } from '../Registry';
import { UI_Element } from '../ui_components/elements/UI_Element';
import { UI_ListItem } from '../ui_components/elements/UI_ListItem';
import { UI_Panel, UI_Region } from '../plugin/UI_Panel';
import { UIController } from './UIController';
import { UI_Renderer } from '../plugin/UI_PluginFactory';
import { ApplicationError } from '../services/ErrorService';

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

export abstract class ParamController<T = any> {
    paramType: InputParamType;
    protected context: PropContext;
    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.context = new PropContext(registry);
    }

    acceptedProps(context: PropContext, element: UI_Element): string[] { return []; }

    change?(val: T, context?: PropContext<any>, element?: UI_Element) {}
    click?(context: PropContext<T>, element: UI_Element) {}
    focus?(context: PropContext<T>, element: UI_Element) {}
    blur?(context: PropContext<T>, element: UI_Element) {}
    defaultVal?(context: PropContext<T>, element: UI_Element) {}
    values?(context: PropContext<T>, element: UI_Element): T[] { return []; }
    val(): T { return undefined; }
    selectedValues?(element: UI_Element): T[] { return []; }
}

export abstract class MultiSelectController extends ParamController {
    protected tempVal: string[];
    paramType = InputParamType.MultiSelect;
    isPopupOpen: boolean = false;

    open() {}
    done() {}
    cancel() {}
    select(val: string) {}
    remove(val: string) {}
}

export abstract class TextFieldController extends ParamController {
    private tempVal: string;
    private inputType: 'number' | 'text';
    private region:  UI_Region;

    constructor(registry: Registry, inputType: 'number' | 'text', region:  UI_Region) {
        super(registry);
        this.inputType = inputType;
        this.region = region;
    }

    abstract initialVal(): any;
    abstract finish(val: any): void;

    val() {
        if (this.tempVal !== undefined) {
            return this.tempVal;
        } else {
            return this.initialVal();
        }
    }

    change(val: string) {
        this.tempVal = val;
        this.registry.services.render.reRender(this.region);
    }

    async blur() {
        const val = this.inputType === 'number' ? this.parseNumber() : this.tempVal;
        this.tempVal = undefined;

        this.finish(val);
        this.registry.services.render.reRenderAll();
    }

    private parseNumber() {
        try {
            return parseFloat(this.tempVal);
        } catch(e) {
            this.registry.services.error.setError(new ApplicationError(e));
            return this.initialVal();
        }
    }
}

export abstract class DragAndDropController extends ParamController {
    abstract onDndStart(dropId: string);
    abstract onDndEnd();
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
    private propControllers: ParamController<any>[] = [];
    private propContexts: Map<ParamController, PropContext> = new Map();

    protected registry: Registry;
    panel: UI_Panel;

    param: UIController;

    constructor(panel: UI_Panel, registry: Registry, propControls: ParamController<any>[], paramControllers?: UIController) {
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

    private findController(element: UI_Element): ParamController {
        return this.propControllers.find(controller => controller.acceptedProps(this.propContexts.get(controller), element).includes(element.key));
    }

    registerPropControl(propController: ParamController<any>) {
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

class CloseDialogController extends ParamController {
    acceptedProps() { return [GlobalControllerProps.CloseDialog]; }

    click(context: PropContext) {
        context.registry.ui.helper.setDialogPanel(undefined);
        context.registry.services.render.reRenderAll();
    }
}