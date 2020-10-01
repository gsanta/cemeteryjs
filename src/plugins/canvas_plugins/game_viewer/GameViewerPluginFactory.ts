import { AbstractCanvasPlugin, ZoomInControl, ZoomOutControl } from "../../../core/plugin/AbstractCanvasPlugin";
import { PropController } from "../../../core/plugin/controller/FormController";
import { PluginFactory } from "../../../core/plugin/PluginFactory";
import { CameraTool } from "../../../core/plugin/tools/CameraTool";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { GameViewerPlugin, GameViewerPluginId } from "./GameViewerPlugin";
import { PlayController, StopController as StopController } from "./GameViewerProps";
import { GameTool } from "./tools/GameTool";

export const GameViewerToolControllerId = 'game-viewer-tool-controller';

export class GameViewerPluginFactory implements PluginFactory {
    pluginId = GameViewerPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new GameViewerPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new ZoomInControl(),
            new ZoomOutControl(),
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
}