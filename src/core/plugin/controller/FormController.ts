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
    protected isFocused = false;
    paramType: InputParamType;
    protected context: PropContext;
    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.context = new PropContext(registry);
    }

    change?(val: T) {}
    click?() {}
    focus?() {}
    blur?() {}
    values?(): T[] { return []; }
    val(): T { return undefined; }
    selectedValues?(): T[] { return []; }
}

export abstract class MultiSelectController extends PropController {
    protected tempVal: string[];
    paramType = InputParamType.MultiSelect;
    isPopupOpen: boolean = false;

    open() {}
    done() {}
    cancel() {}
    select(val: string) {}
}

export abstract class ListController extends PropController {
    select(val: string) {}
}

export abstract class DragAndDropController extends PropController {
    onDndStart() {}
    onDndEnd(dropId: string) {}
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

        if (propControls) {
            propControls.forEach(propControl => {
                this.registerPropControl(propControl);
            });
        }

        if (paramControllers) {
            Object.entries(this.param).forEach(entry => this.registerPropControl(entry[1]));
        }
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