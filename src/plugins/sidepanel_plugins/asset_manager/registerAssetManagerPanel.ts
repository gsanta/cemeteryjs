import { FormController } from "../../../core/controller/FormController";
import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { AssetManagerPanelRenderer } from "./AssetManagerPanelRenderer";
import { IsAssetManagerDialogOpenController } from "./AssetManagerSidepanelProps";

export const AssetManagerPanelId = 'asset-manager-panel'; 

export function registerAssetManagerPanel(registry: Registry) {
    const panel = createPanel(registry);

    registry.ui.panel.registerPanel(panel);
}

function createPanel(registry: Registry): UI_Panel {

    const panel = new UI_Panel(registry, UI_Region.Sidepanel, AssetManagerPanelId, 'Asset Manager');
    panel.renderer = new AssetManagerPanelRenderer();

    const propControllers = [
        new IsAssetManagerDialogOpenController(registry)
    ];

    panel.controller = new FormController(panel, registry, propControllers);

    return panel;
}