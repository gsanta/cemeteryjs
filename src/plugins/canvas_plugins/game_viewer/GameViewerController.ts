import { PropController, FormController } from "../../../core/plugin/controller/FormController";
import { GameViewerPlugin } from "./GameViewerPlugin";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { AbstractCanvasPlugin } from "../../../core/plugin/AbstractCanvasPlugin";
import { Registry } from "../../../core/Registry";
import { ToolType } from "../../../core/plugin/tools/Tool";
import { GameViewerToolControllerId } from "./GameViewerPluginFactory";
import { ToolController } from "../../../core/plugin/controller/ToolController";

export enum GameViewerProps {
    ZoomIn = 'zoomIn',
    ZoomOut = 'ZoomOut',
    Play = 'Play',
    Stop = 'Stop'
}

export const GameViewerControllerId = 'game-viewer-controller';

export class GameViewerController extends FormController {
    id = GameViewerControllerId;
    plugin: GameViewerPlugin;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(plugin, registry);

        this.registerPropControl(GameViewerProps.ZoomIn, ZoomInControl);
        this.registerPropControl(GameViewerProps.ZoomOut, ZoomOutControl);
        this.registerPropControl(GameViewerProps.Play, PlayControl);
        this.registerPropControl(GameViewerProps.Stop, StopControl);
    }
}

const ZoomInControl: PropController<any> = {
    click(context, element, controller: GameViewerController) {
        const toolController = <ToolController> context.registry.plugins.getControllers(context.plugin.id).get(GameViewerToolControllerId);
        (toolController.getById(ToolType.Camera) as CameraTool).zoomIn();
    }
}

const ZoomOutControl: PropController<any> = {
    click(context, element, controller: GameViewerController) {
        const toolController = <ToolController> context.registry.plugins.getControllers(context.plugin.id).get(GameViewerToolControllerId);
        (toolController.getById(ToolType.Camera) as CameraTool).zoomOut();
    }
}

const PlayControl: PropController<any> = {
    click(context, element, controller: GameViewerController) {
        (<GameViewerPlugin> context.plugin).isPlaying = true;
        context.registry.services.render.reRender(context.plugin.region);
    }
}

const StopControl: PropController<any> = {
    click(context, element, controller: GameViewerController) {
        (<GameViewerPlugin> context.plugin).isPlaying = false;
        context.registry.services.render.reRender(context.plugin.region);
    }
}