import { Registry } from "../../Registry";
import { AbstractController } from './AbstractController';
import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { ToolType } from '../../../plugins/common/tools/Tool';
import { CameraTool } from '../../../plugins/common/tools/CameraTool';

export enum CanvasControllerProps {
    ZoomIn = 'zoomIn',
    ZoomOut = 'ZoomOut',
    Undo = 'undo',
    Redo = 'redo'
}

export const CanvasControllerId = 'canvas_controller_id';

export class CanvasController extends AbstractController {
    id = CanvasControllerId;
    plugin: AbstractCanvasPlugin;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler(CanvasControllerProps.ZoomIn)
            .onClick(() => (this.plugin.toolHandler.getById(ToolType.Camera) as CameraTool).zoomIn());

        this.createPropHandler(CanvasControllerProps.ZoomOut)
            .onClick(() => (this.plugin.toolHandler.getById(ToolType.Camera) as CameraTool).zoomOut());

        this.createPropHandler(CanvasControllerProps.Undo)
            .onClick(() => this.registry.services.history.undo());

        this.createPropHandler(CanvasControllerProps.Redo)
            .onClick(() => this.registry.services.history.redo());

    }
}