import { PropContext, PropController } from "../../../core/plugin/controller/FormController";
import { AssetManagerDialogPluginId } from "../../dialog_plugins/asset_manager/AssetManagerDialogPlugin";

export enum AssetManagerSidepanelControllerProps {
    IsAssetManagerDialogOpen = 'IsAssetManagerDialogOpen'
}

export class IsAssetManagerDialogOpenController extends PropController {
    acceptedProps() { return [AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen]; }

    click(context: PropContext) {
        context.registry.plugins.showPlugin(AssetManagerDialogPluginId);
    }
}
