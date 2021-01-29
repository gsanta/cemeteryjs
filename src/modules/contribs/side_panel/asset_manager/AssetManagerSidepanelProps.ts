import { PropContext, ParamController } from "../../../../core/controller/FormController";
import { AssetManagerDialogId } from "../../dialogs/asset_manager/registerAssetManagerDialog";

export enum AssetManagerSidepanelControllerProps {
    IsAssetManagerDialogOpen = 'IsAssetManagerDialogOpen'
}

export class IsAssetManagerDialogOpenController extends ParamController {
    acceptedProps() { return [AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen]; }

    click(context: PropContext) {
        const dialog = context.registry.services.module.ui.getPanel(AssetManagerDialogId);
        context.registry.ui.helper.setDialogPanel(dialog);
    }
}
