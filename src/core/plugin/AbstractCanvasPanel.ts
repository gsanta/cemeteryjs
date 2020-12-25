import { Point } from '../../utils/geometry/shapes/Point';
import { Rectangle } from '../../utils/geometry/shapes/Rectangle';
import { ICamera } from '../models/misc/camera/ICamera';
import { Registry } from '../Registry';
import { KeyboardService } from '../services/input/KeyboardService';
import { UI_Element } from '../ui_components/elements/UI_Element';
import { UI_ListItem } from '../ui_components/elements/UI_ListItem';
import { FormController, PropContext, PropController } from './controller/FormController';
import { ToolController } from './controller/ToolController';
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

export abstract class AbstractCanvasPanel extends UI_Panel {
    readonly displayName: string;

    protected gizmos: GizmoPlugin[] = [];

    readonly keyboard: KeyboardService;

    protected renderFunc: () => void;

    private camera: ICamera;
    
    readonly toolController: ToolController;

    constructor(registry: Registry, region: UI_Region, id: string, displayName: string) {
        super(registry, region, id, displayName);

        this.id = id;
        this.displayName = displayName;

        this.toolController = new ToolController(this, registry);
        this.keyboard = new KeyboardService(registry);
    }

    protected setCamera(camera: ICamera) {
        this.camera = camera;
    }

    setController(controller: FormController) {
        this.controller = controller;
    }

    addTool(tool: Tool) {
        this.toolController.registerTool(tool);
    }

    addGizmo(gizmo: GizmoPlugin) {
        this.gizmos.push(gizmo);
    }

    getGizmos(): GizmoPlugin[] {
        return this.gizmos;
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
        this.registry.services.pointer.hoveredView = undefined;
    }

    getOffset() {
        return calcOffsetFromDom(this.htmlElement);
    }

    getCamera(): ICamera { 
        return this.camera;
    };
}

export const ZoomInProp = 'zoom-in';
export class ZoomInController extends PropController {
    acceptedProps() { return [ZoomInProp]; }

    click(context: PropContext, element: UI_Element) {
        const cameraTool = <CameraTool> element.canvasPanel.toolController.getToolById(CameraToolId);
        cameraTool.zoomIn();
    }
}

export const ZoomOutProp = 'zoom-out';
export class ZoomOutController extends PropController {
    acceptedProps() { return [ZoomOutProp]; }

    click(context: PropContext, element: UI_Element) {
        const cameraTool = <CameraTool> element.canvasPanel.toolController.getToolById(CameraToolId);
        cameraTool.zoomOut();
    }
}

export const UndoProp = 'undo';
export class UndoController extends PropController<any> {
    acceptedProps() { return [UndoProp]; }

    click(context: PropContext) {
        context.registry.services.history.undo();
    }
}

export const RedoProp = 'redo';

export class RedoController extends PropController<any> {
    acceptedProps() { return [RedoProp]; }

    click(context: PropContext) {
        context.registry.services.history.redo();
    }
}
