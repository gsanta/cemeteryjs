import { UI_Panel, UI_Region } from '../../../core/plugin/UI_Panel';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { AssetManagerSidepanelControllerProps } from './AssetManagerSidepanelProps';

export const AssetManagerSidepanelPluginId = 'asset-manager-sidepanel-plugin' 
export class AssetManagerSidepanelPlugin extends UI_Panel {
    id = 'asset-manager-sidepanel-plugin';
    displayName = 'Asset manager';
    region = UI_Region.Sidepanel;

    renderInto(layout: UI_Layout): void {
        let row = layout.row({ key: AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen });
        const manageAssetsButton = row.button(AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen);
        manageAssetsButton.label = 'Manage assets';
        manageAssetsButton.width = '200px';
    }
}