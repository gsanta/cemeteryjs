import { AbstractController } from "../../core/plugins/controllers/AbstractController";
import { Registry } from "../../core/Registry";
import { AssetManagerDialogPluginId } from "./AssetManagerDialogPlugin";
import { UI_Plugin } from "../../core/UI_Plugin";

export enum AssetManagerSidepanelControllerProps {
    IsAssetManagerDialogOpen = 'IsAssetManagerDialogOpen'
}

export const AssetManagerSidepanelControllerId = 'asset_manager_sidepanel_controller'
export class AssetManagerSidepanelController extends AbstractController<AssetManagerSidepanelControllerProps> {
    id = AssetManagerSidepanelControllerId;
    
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<number>(AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen)
            .onClick((val) => {
                this.registry.plugins.activatePlugin(AssetManagerDialogPluginId);
            });
    }
}
