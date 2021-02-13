import { Point } from '../../../utils/geometry/shapes/Point';
import { FormController, ParamController, PropContext } from '../../controller/FormController';
import { ToolHandler } from '../../controller/ToolHandler';
import { ICamera } from '../misc/camera/ICamera';
import { Registry } from '../../Registry';
import { AbstractModuleExporter } from '../../services/export/AbstractModuleExporter';
import { AbstractModuleImporter } from '../../services/import/AbstractModuleImporter';
import { HotkeyHandler } from '../../controller/HotkeyHandler';
import { KeyboardHandler } from '../../controller/KeyboardHandler';
import { PointerHandler } from '../../controller/PointerHandler';
import { UI_Element } from '../../ui_components/elements/UI_Element';
import { CameraTool, CameraToolId } from '../../controller/tools/CameraTool';
import { Tool } from '../../controller/tools/Tool';
import { UI_Panel, UI_Region } from '../UI_Panel';
import { IStore } from '../../data/stores/IStore';
import { ItemData } from '../../data/ItemData';
import { CanvasObservable } from '../CanvasObservable';

function getScreenSize(htmlElement: HTMLElement): Point {
    const rect: ClientRect = htmlElement.getBoundingClientRect();
    return new Point(rect.width, rect.height);
}

export function calcOffsetFromDom(element: HTMLElement): Point {
    if (element && typeof document !== 'undefined') {
        const rect: ClientRect = element.getBoundingClientRect();
        return new Point(rect.left - element.scrollLeft, rect.top - element.scrollTop);
    }

    return new Point(0, 0);
}

export enum InteractionMode {
    Edit = 'Edit',
    Execution = 'Execution'
}

export abstract class AbstractCanvasPanel<D> extends UI_Panel {
    readonly displayName: string;

    readonly keyboard: KeyboardHandler<D>;
    readonly hotkey: HotkeyHandler<D>;
    readonly tool: ToolHandler<D>;
    readonly pointer: PointerHandler<D>;
    
    abstract readonly data: ItemData<D>;
    readonly observable: CanvasObservable;


    private camera: ICamera;

    interactionMode = InteractionMode.Edit;

    abstract exporter: AbstractModuleExporter;
    abstract importer: AbstractModuleImporter;

    constructor(registry: Registry, region: UI_Region, id: string, displayName: string) {
        super(registry, region, id, displayName);

        this.id = id;
        this.displayName = displayName;

        this.tool = new ToolHandler(this, registry);
        this.keyboard = new KeyboardHandler(registry, this);
        this.pointer = new PointerHandler(this.registry, this);
        this.hotkey = new HotkeyHandler(this.registry, this);
        this.observable = new CanvasObservable();
    }

    protected setCamera(camera: ICamera) {
        this.camera = camera;
    }

    setController(controller: FormController) {
        this.controller = controller;
    }

    addTool(tool: Tool<D>) {
        this.tool.registerTool(tool);
    }

    destroy(): void {}

    resize(): void {
        const screenSize = getScreenSize(this.htmlElement);
        screenSize && this.getCamera().resize(screenSize);
        this.pointer.pointer.screenSize = screenSize; 

        this.registry.services.render.reRender(this.region);
    }

    over(): void { this.registry.ui.helper.hoveredPanel = this }
    out(): void {
        this.registry.ui.helper.hoveredPanel = undefined;
        this.pointer.pointer.pickedItem = undefined;
    }

    mounted(htmlElement: HTMLElement) {
        super.mounted(htmlElement);
        this.pointer.pointer.screenSize = getScreenSize(this.htmlElement); 
    }

    getOffset() {
        return calcOffsetFromDom(this.htmlElement);
    }

    getCamera(): ICamera { 
        return this.camera;
    };
}

export const ZoomInProp = 'zoom-in';
export class ZoomInController extends ParamController {
    acceptedProps() { return [ZoomInProp]; }

    click(context: PropContext, element: UI_Element) {
        const cameraTool = <CameraTool<any>> element.canvasPanel.tool.getToolById(CameraToolId);
        cameraTool.zoomIn();
    }
}

export const ZoomOutProp = 'zoom-out';
export class ZoomOutController extends ParamController {
    acceptedProps() { return [ZoomOutProp]; }

    click(context: PropContext, element: UI_Element) {
        const cameraTool = <CameraTool<any>> element.canvasPanel.tool.getToolById(CameraToolId);
        cameraTool.zoomOut();
    }
}

export const UndoProp = 'undo';
export class UndoController extends ParamController<any> {
    click() {
        this.registry.services.history.undo();
    }
}

export const RedoProp = 'redo';

export class RedoController extends ParamController<any> {
    click() {
        this.registry.services.history.redo();
    }
}
