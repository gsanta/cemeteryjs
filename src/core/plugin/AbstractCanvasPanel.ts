import { Point } from '../../utils/geometry/shapes/Point';
import { FormController, ParamController, PropContext } from '../controller/FormController';
import { ToolHandler } from '../controller/ToolHandler';
import { ICamera } from '../models/misc/camera/ICamera';
import { Registry } from '../Registry';
import { AbstractModuleExporter } from '../services/export/AbstractModuleExporter';
import { AbstractModuleImporter } from '../services/import/AbstractModuleImporter';
import { HotkeyHandler } from '../controller/HotkeyHandler';
import { KeyboardHandler } from '../controller/KeyboardHandler';
import { PointerHandler } from '../controller/PointerHandler';
import { UI_Element } from '../ui_components/elements/UI_Element';
import { GizmoPlugin } from './IGizmo';
import { CameraTool, CameraToolId } from './tools/CameraTool';
import { Tool } from './tools/Tool';
import { UI_Panel, UI_Region } from './UI_Panel';

function getScreenSize(canvasId: string): Point {
    if (typeof document !== 'undefined') {
        const svg: HTMLElement = document.getElementById(canvasId);

        if (svg) {
            const rect: ClientRect = svg.getBoundingClientRect();
            return new Point(rect.width, rect.height);
        }
    }
    return undefined;
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

export abstract class AbstractCanvasPanel<M = any> extends UI_Panel {
    model: M;
    readonly displayName: string;

    readonly keyboard: KeyboardHandler;
    readonly hotkey: HotkeyHandler;
    readonly tool: ToolHandler;
    readonly pointer: PointerHandler;

    protected renderFunc: () => void;

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
    }

    protected setCamera(camera: ICamera) {
        this.camera = camera;
    }

    setController(controller: FormController) {
        this.controller = controller;
    }

    addTool(tool: Tool) {
        this.tool.registerTool(tool);
    }

    destroy(): void {}

    resize(): void {
        const screenSize = getScreenSize(this.id);
        screenSize && this.getCamera().resize(screenSize);

        this.registry.services.render.reRender(this.region);
    }

    over(): void { this.registry.ui.helper.hoveredPanel = this }
    out(): void {
        this.registry.ui.helper.hoveredPanel = undefined;
        this.pointer.hoveredView = undefined;
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
        const cameraTool = <CameraTool> element.canvasPanel.tool.getToolById(CameraToolId);
        cameraTool.zoomIn();
    }
}

export const ZoomOutProp = 'zoom-out';
export class ZoomOutController extends ParamController {
    acceptedProps() { return [ZoomOutProp]; }

    click(context: PropContext, element: UI_Element) {
        const cameraTool = <CameraTool> element.canvasPanel.tool.getToolById(CameraToolId);
        cameraTool.zoomOut();
    }
}

export const UndoProp = 'undo';
export class UndoController extends ParamController<any> {
    acceptedProps() { return [UndoProp]; }

    click(context: PropContext) {
        context.registry.services.history.undo();
    }
}

export const RedoProp = 'redo';

export class RedoController extends ParamController<any> {
    acceptedProps() { return [RedoProp]; }

    click(context: PropContext) {
        context.registry.services.history.redo();
    }
}
