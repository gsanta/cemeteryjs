import { Point } from '../../utils/geometry/shapes/Point';
import { Rectangle } from '../../utils/geometry/shapes/Rectangle';
import { ICamera } from '../models/misc/camera/ICamera';
import { Registry } from '../Registry';
import { KeyboardService } from '../services/input/KeyboardService';
import { UI_ListItem } from '../ui_components/elements/UI_ListItem';
import { PropContext, PropController } from './controller/FormController';
import { GizmoPlugin } from './IGizmo';
import { CameraTool, CameraToolId } from './tools/CameraTool';
import { ToolType } from './tools/Tool';
import { UI_Plugin } from './UI_Plugin';

export interface CanvasViewSettings {
    initialSizePercent: number;
    minSizePixel: number;
}

export function calcOffsetFromDom(element: HTMLElement): Point {
    if (typeof document !== 'undefined') {
        const rect: ClientRect = element.getBoundingClientRect();
        return new Point(rect.left - element.scrollLeft, rect.top - element.scrollTop);
    }

    return new Point(0, 0);
}

export abstract class AbstractCanvasPlugin extends UI_Plugin {
    dropItem: UI_ListItem;
    bounds: Rectangle;

    protected gizmos: GizmoPlugin[] = [];

    readonly keyboard: KeyboardService;

    protected renderFunc: () => void;

    constructor(registry: Registry) {
        super(registry);

        this.keyboard = new KeyboardService(registry);
    }

    addGizmo(gizmo: GizmoPlugin) {
        this.gizmos.push(gizmo);
    }

    destroy(): void {}
    resize() {};
    over(): void { this.registry.plugins.setHoveredView(this) }
    out(): void {
        this.registry.plugins.removeHoveredView(this);
        this.registry.services.pointer.hoveredItem = undefined;
    }

    mounted(htmlElement: HTMLElement) {
        super.mounted(htmlElement);

        const boundingRect = htmlElement.getBoundingClientRect();
        this.bounds = new Rectangle(new Point(boundingRect.left, boundingRect.top), new Point(boundingRect.width, boundingRect.height));
    }

    getOffset(): Point { return new Point(0, 0) }
    getCamera(): ICamera { 
        return undefined;
    };

    getToolController() {
        return this.registry.plugins.getToolController(this.id);
    }
}

export const ZoomInProp = 'zoom-in';
export class ZoomInController extends PropController {
    acceptedProps() { return [ZoomInProp]; }

    click(context: PropContext) {
        const cameraTool = <CameraTool> context.registry.plugins.getToolController(context.plugin.id).getToolById(CameraToolId);
        cameraTool.zoomIn();
    }
}

export const ZoomOutProp = 'zoom-out';
export class ZoomOutController extends PropController {
    acceptedProps() { return [ZoomOutProp]; }

    click(context: PropContext) {
        const cameraTool = <CameraTool> context.registry.plugins.getToolController(context.plugin.id).getToolById(CameraToolId);
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
