import { PropController } from "../../../core/plugin/controller/FormController";
import { UI_PluginFactory } from "../../../core/plugin/UI_PluginFactory";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Panel } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { LevelSettingsPlugin, LevelSettingsPluginId } from "./LevelSettingsPlugin";
import { ClearLevelController, LevelController, LevelNameController } from "./LevelSettingsProps";

export const AssetManagerControllerId = 'asset-manager-controller';

export class LevelSettingsPluginFactory implements UI_PluginFactory {
    pluginId = LevelSettingsPluginId;
    
    createPlugin(registry: Registry): UI_Panel {
        return new LevelSettingsPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new LevelController(),
            new LevelNameController(),
            new ClearLevelController()
        ];
    }

    createTools(): Tool[] { return []; }
}