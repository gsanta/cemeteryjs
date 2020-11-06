import { IRenderer } from "../../../core/plugin/IRenderer";
import { UI_Container } from "../../../core/ui_components/elements/UI_Container";
import { UI_Layout } from "../../../core/ui_components/elements/UI_Layout";
import { AssetManagerSidepanelControllerProps } from "./AssetManagerSidepanelProps";


export class AssetManagerPanelRenderer implements IRenderer<UI_Layout> {
    renderInto(layout: UI_Layout): void {
        let row = layout.row({ key: AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen });
        const manageAssetsButton = row.button(AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen);
        manageAssetsButton.label = 'Manage assets';
        manageAssetsButton.width = '200px';
    }
}