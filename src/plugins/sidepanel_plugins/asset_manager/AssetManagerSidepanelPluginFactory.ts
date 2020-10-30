import { PropController } from "../../../core/plugin/controller/FormController";
import { UI_PluginFactory } from "../../../core/plugin/UI_PluginFactory";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Panel } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { AssetManagerSidepanelPlugin, AssetManagerSidepanelPluginId } from "./AssetManagerSidepanelPlugin";
import { IsAssetManagerDialogOpenController } from "./AssetManagerSidepanelProps";

export class AssetManagerSidepanelPluginFactory implements UI_PluginFactory {
    pluginId = AssetManagerSidepanelPluginId;
    
    createPlugin(registry: Registry): UI_Panel {
        return new AssetManagerSidepanelPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new IsAssetManagerDialogOpenController(),
        ];
    }

    createTools(): Tool[] { return []; }
}