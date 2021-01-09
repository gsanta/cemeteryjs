import { FormController } from "../../../core/controller/FormController";
import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { AssetManagerControllers } from "./AssetManagerProps";

export const AssetManagerDialogId = 'asset-manager-dialog';

export function registerAssetManagerDialog(registry: Registry) {
    const panel = createDialog(registry);

    registry.ui.panel.registerPanel(panel);
}

function createDialog(registry: Registry): UI_Panel {
    const panel = new UI_Panel(registry, UI_Region.Dialog, AssetManagerDialogId, 'Asset Manager');
    panel.controller = new FormController(undefined, registry, [], new AssetManagerControllers(registry));

    return panel;
}