import { PropContext, ParamController } from "../../../core/controller/FormController";
import { AssetManagerDialogId } from "../../dialog_plugins/asset_manager/registerAssetManagerDialog";

export enum AssetManagerSidepanelControllerProps {
    IsAssetManagerDialogOpen = 'IsAssetManagerDialogOpen'
}

export class IsAssetManagerDialogOpenController extends ParamController {
    acceptedProps() { return [AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen]; }

    click(context: PropContext) {
        const dialog = context.registry.ui.panel.getPanel(AssetManagerDialogId);
        context.registry.ui.helper.setDialogPanel(dialog);
    }
}
