import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { Registry } from '../../core/Registry';
import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { AssetManagerSidepanelController, AssetManagerSidepanelControllerProps, AssetManagerSidepanelControllerId } from './AssetManagerSidepanelController';

export const AssetManagerSidepanelPluginId = 'asset-manager-sidepanel-plugin' 
export class AssetManagerSidepanelPlugin extends UI_Plugin {
    id = 'asset-manager-sidepanel-plugin';
    region = UI_Region.Sidepanel;

    constructor(registry: Registry) {
        super(registry);

        this.controllers.set(AssetManagerSidepanelControllerId, new AssetManagerSidepanelController(this, registry));
    }

    renderInto(layout: UI_Layout): void {
        layout.controllerId = AssetManagerSidepanelControllerId;
        let row = layout.row(null);
        const manageAssetsButton = row.button(AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen);
        manageAssetsButton.label = 'Manage assets';
    }
}