import { FormController } from "../../../core/plugin/controller/FormController";
import { Registry } from "../../../core/Registry";
import { AssetManagerDialogPluginId } from "../../dialog_plugins/asset_manager/AssetManagerDialogPlugin";
import { UI_Plugin } from "../../../core/plugin/UI_Plugin";

export enum AssetManagerSidepanelControllerProps {
    IsAssetManagerDialogOpen = 'IsAssetManagerDialogOpen'
}

export const AssetManagerSidepanelControllerId = 'asset_manager_sidepanel_controller'
export class AssetManagerSidepanelController extends FormController {
    id = AssetManagerSidepanelControllerId;
    
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<number>(AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen)
            .onClick((val) => {
                this.registry.plugins.showPlugin(AssetManagerDialogPluginId);
            });
    }
}
