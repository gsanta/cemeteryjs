import { FormController, PropContext, PropController } from "../../../core/plugin/controller/FormController";
import { PluginFactory } from "../../../core/plugin/PluginFactory";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { AssetManagerDialogPlugin, AssetManagerDialogPluginId } from "./AssetManagerDialogPlugin";
import { AssetNameControl, AssetPathControl, CancelEditControl, DeleteAssetControl, EnterEditModeControl, SaveEditControl } from "./AssetManagerProps";

export const AssetManagerControllerId = 'asset-manager-controller';

export class AssetManagerPluginFactory implements PluginFactory {
    pluginId = AssetManagerDialogPluginId;
    
    createPlugin(registry: Registry): UI_Plugin {
        return new AssetManagerDialogPlugin(registry);
    }

    createControllers(plugin: UI_Plugin, registry: Registry): FormController[] {
        const props: PropController[] = [
            new DeleteAssetControl(),
            new EnterEditModeControl(),
            new AssetNameControl(),
            new AssetPathControl(),
            new SaveEditControl(),
            new CancelEditControl()
        ];

        const controller = new FormController(plugin, registry, AssetManagerControllerId, props);
        return [controller];
    }
}