import { PropControl, AbstractController } from "../../../core/plugin/controller/AbstractController";
import { GameViewerPlugin } from "./GameViewerPlugin";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { AbstractCanvasPlugin } from "../../../core/plugin/AbstractCanvasPlugin";
import { Registry } from "../../../core/Registry";
import { ToolType } from "../../../core/plugin/tools/Tool";

export enum GameViewerProps {
    ZoomIn = 'zoomIn',
    ZoomOut = 'ZoomOut'
}

export class GameViewerController extends AbstractController {
    id = 'game-viewer-controller';
    plugin: GameViewerPlugin;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(plugin, registry);

        this.registerPropControl(GameViewerProps.ZoomIn, ZoomInControl);
        this.registerPropControl(GameViewerProps.ZoomOut, ZoomOutControl);
    }
}

const ZoomInControl: PropControl<any> = {
    click(context, element, controller: GameViewerController) {
        (controller.plugin.toolHandler.getById(ToolType.Camera) as CameraTool).zoomIn();
    }
}

const ZoomOutControl: PropControl<any> = {
    click(context, element, controller: GameViewerController) {
        (controller.plugin.toolHandler.getById(ToolType.Camera) as CameraTool).zoomOut();
    }
}