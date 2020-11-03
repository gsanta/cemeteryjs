import { Point } from '../../utils/geometry/shapes/Point';
import { Rectangle } from '../../utils/geometry/shapes/Rectangle';
import { ICamera } from '../models/misc/camera/ICamera';
import { View } from '../models/views/View';
import { Registry } from '../Registry';
import { KeyboardService } from '../services/input/KeyboardService';
import { UI_ListItem } from '../ui_components/elements/UI_ListItem';
import { UI_SvgCanvas } from '../ui_components/elements/UI_SvgCanvas';
import { FormController, PropContext, PropController } from './controller/FormController';
import { ToolController } from './controller/ToolController';
import { ICanvasRenderer } from './ICanvasRenderer';
import { GizmoPlugin } from './IGizmo';
import { CameraTool, CameraToolId } from './tools/CameraTool';
import { Tool } from './tools/Tool';
import { UI_Panel, UI_Region } from './UI_Panel';
import { UI_Plugin } from './UI_Plugin';

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
    if (typeof document !== 'undefined') {
        const rect: ClientRect = element.getBoundingClientRect();
        return new Point(rect.left - element.scrollLeft, rect.top - element.scrollTop);
    }

    return new Point(0, 0);
}

export class AbstractCanvasPlugin extends UI_Panel {
    dropItem: UI_ListItem;
    bounds: Rectangle;

    protected gizmos: GizmoPlugin[] = [];

    readonly keyboard: KeyboardService;

    protected renderFunc: () => void;

    private camera: ICamera;
    
    readonly controller: FormController;
    readonly toolController: ToolController;

    renderer: ICanvasRenderer;

    constructor(registry: Registry, camera: ICamera, region: UI_Region, id: string, controller: FormController) {
        super(registry);

        this.region = region;
        this.camera = camera;
        this.id = id;
        this.controller = controller;
        
        this.keyboard = new KeyboardService(registry);
    }

    addTool(tool: Tool) {
        this.toolController.registerTool(tool);
    }

    addGizmo(gizmo: GizmoPlugin) {
        this.gizmos.push(gizmo);
    }

    destroy(): void {
        this.registry.stores.views.clearSelection();
    }

    resize(): void {
        const screenSize = getScreenSize(this.id);
        screenSize && this.getCamera().resize(screenSize);
        this.renderFunc && this.renderFunc();
    }

    over(): void { this.registry.plugins.setHoveredPlugin(this) }
    out(): void {
        this.registry.plugins.removeHoveredPlugin(this);
        this.registry.services.pointer.hoveredView = undefined;
    }

    mounted(htmlElement: HTMLElement) {
        super.mounted(htmlElement);

        const boundingRect = htmlElement.getBoundingClientRect();
        this.bounds = new Rectangle(new Point(boundingRect.left, boundingRect.top), new Point(boundingRect.width, boundingRect.height));
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

    click(context: PropContext) {
        const cameraTool = <CameraTool> context.plugin.tool.getToolById(CameraToolId);
        cameraTool.zoomIn();
    }
}

export const ZoomOutProp = 'zoom-out';
export class ZoomOutController extends PropController {
    acceptedProps() { return [ZoomOutProp]; }

    click(context: PropContext) {
        const cameraTool = <CameraTool> context.plugin.getToolController().getToolById(CameraToolId);
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
