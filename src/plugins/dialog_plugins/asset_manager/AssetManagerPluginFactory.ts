import { PropController } from "../../../core/plugin/controller/FormController";
import { UI_PluginFactory } from "../../../core/plugin/UI_PluginFactory";
import { Tool } from "../../../core/plugin/tools/Tool";
import { UI_Panel } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { AssetManagerDialogPlugin, AssetManagerDialogPluginId } from "./AssetManagerDialogPlugin";
import { AssetNameControl, AssetPathControl, CancelEditControl, DeleteAssetControl, EnterEditModeControl, SaveEditControl } from "./AssetManagerProps";

export const AssetManagerControllerId = 'asset-manager-controller';

export class AssetManagerPluginFactory implements UI_PluginFactory {
    pluginId = AssetManagerDialogPluginId;
    
    createPlugin(registry: Registry): UI_Panel {
        return new AssetManagerDialogPlugin(registry);
    }

    createPropControllers(): PropController[] {
        return [
            new DeleteAssetControl(),
            new EnterEditModeControl(),
            new AssetNameControl(),
            new AssetPathControl(),
            new SaveEditControl(),
            new CancelEditControl()
        ];
    }

    createTools(): Tool[] { return []; }
}