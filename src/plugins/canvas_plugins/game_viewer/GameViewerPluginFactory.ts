import { AbstractCanvasPlugin } from "../../../core/plugin/AbstractCanvasPlugin";
import { ToolController } from "../../../core/plugin/controller/ToolController";
import { UI_Controller } from "../../../core/plugin/controller/UI_Controller";
import { PluginFactory } from "../../../core/plugin/PluginFactory";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { GameViewerController } from "./GameViewerController";
import { GameViewerPlugin, GameViewerPluginId } from "./GameViewerPlugin";
import { GameTool } from "./tools/GameTool";

export const GameViewerToolControllerId = 'game-viewer-tool-controller';

export class GameViewerPluginFactory implements PluginFactory {
    pluginId = GameViewerPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new GameViewerPlugin(registry);
    }

    createPropControllers(plugin: UI_Plugin, registry: Registry): UI_Controller[] {
        const controller = new ToolController(GameViewerToolControllerId, plugin as AbstractCanvasPlugin, registry);

        controller.registerTool(new GameTool(plugin as AbstractCanvasPlugin, registry));
        controller.registerTool(new CameraTool(plugin as AbstractCanvasPlugin, controller, registry));

        const gameViewerController = new GameViewerController(plugin as AbstractCanvasPlugin, registry);
        
        return [controller, gameViewerController];
    }
}