import { FormController } from "../../../core/plugin/controller/FormController";
import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { DeleteAssetControl, EnterEditModeControl, AssetNameControl, AssetPathControl, SaveEditControl, CancelEditControl } from "./AssetManagerProps";

export const AssetManagerDialogId = 'asset-manager-dialog';

export function registerAssetManagerDialog(registry: Registry) {
    const panel = createDialog(registry);

    registry.ui.panel.registerPanel(panel);
}

function createDialog(registry: Registry): UI_Panel {
    const propControllers = [
        new DeleteAssetControl(),
        new EnterEditModeControl(),
        new AssetNameControl(),
        new AssetPathControl(),
        new SaveEditControl(),
        new CancelEditControl()
    ];

    const panel = new UI_Panel(registry, UI_Region.Dialog, AssetManagerDialogId, 'Asset Manager');
    panel.controller = new FormController(undefined, registry, propControllers);

    return panel;
}