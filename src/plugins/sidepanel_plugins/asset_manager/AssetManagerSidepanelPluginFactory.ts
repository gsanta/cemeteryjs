import { PropController } from "../../../core/plugin/controller/FormController";
import { PluginFactory } from "../../../core/plugin/PluginFactory";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { AssetManagerSidepanelPlugin, AssetManagerSidepanelPluginId } from "./AssetManagerSidepanelPlugin";
import { IsAssetManagerDialogOpenController } from "./AssetManagerSidepanelProps";

export class AssetManagerSidepanelPluginFactory implements PluginFactory {
    pluginId = AssetManagerSidepanelPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new AssetManagerSidepanelPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new IsAssetManagerDialogOpenController(),
        ];
    }

    createTools(): Tool[] { return []; }
}