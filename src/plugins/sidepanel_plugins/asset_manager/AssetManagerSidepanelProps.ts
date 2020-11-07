import { PropContext, PropController } from "../../../core/plugin/controller/FormController";
import { AssetManagerDialogId } from "../../dialog_plugins/asset_manager/registerAssetManagerDialog";

export enum AssetManagerSidepanelControllerProps {
    IsAssetManagerDialogOpen = 'IsAssetManagerDialogOpen'
}

export class IsAssetManagerDialogOpenController extends PropController {
    acceptedProps() { return [AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen]; }

    click(context: PropContext) {
        const dialog = context.registry.ui.panel.getPanel(AssetManagerDialogId);
        context.registry.ui.helper.setDialogPanel(dialog);
    }
}
