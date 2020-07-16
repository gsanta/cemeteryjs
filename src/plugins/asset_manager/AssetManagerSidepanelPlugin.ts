import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { Registry } from '../../core/Registry';
import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { AssetManagerSidepanelController, AssetManagerSidepanelControllerProps } from './AssetManagerSidepanelController';

export const AssetManagerSidepanelPluginId = 'asset-manager-sidepanel-plugin' 
export class AssetManagerSidepanelPlugin extends UI_Plugin {
    id = 'asset-manager-sidepanel-plugin';
    region = UI_Region.SidepanelWidget;

    constructor(registry: Registry) {
        super(registry);

        this.controller = new AssetManagerSidepanelController(registry);
    }

    renderInto(layout: UI_Layout): void {
        const row = layout.row();
        
        const manageAssetsButton = row.button(AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen);
        manageAssetsButton.label = 'Manage assets';
    }
}