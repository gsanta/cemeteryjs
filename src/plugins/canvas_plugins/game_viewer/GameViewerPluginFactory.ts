import { AbstractCanvasPlugin, ZoomInController, ZoomOutController } from "../../../core/plugin/AbstractCanvasPlugin";
import { PropController } from "../../../core/plugin/controller/FormController";
import { UI_PluginFactory } from "../../../core/plugin/UI_PluginFactory";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { GameViewerPlugin, GameViewerPluginId } from "./GameViewerPlugin";
import { PlayController, StopController as StopController } from "./GameViewerProps";
import { GameTool } from "./tools/GameTool";
import { corePlugins } from "../../../core/plugin/corePlugins";

export const GameViewerToolControllerId = 'game-viewer-tool-controller';

export class GameViewerPluginFactory implements UI_PluginFactory {
    pluginId = GameViewerPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new GameViewerPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new ZoomInController(),
            new ZoomOutController(),
            new PlayController(),
            new StopController()
        ]
    }

    createTools(plugin: UI_Plugin, registry: Registry): Tool[] {
        return [
            new GameTool(plugin as AbstractCanvasPlugin, registry),
            new CameraTool(plugin as AbstractCanvasPlugin, registry)
        ];
    }

    gizmos = [corePlugins.canvas.gizmos.AxisGizmo];
}