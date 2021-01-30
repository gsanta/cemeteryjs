import { FormController } from "../../../../core/controller/FormController";
import { UI_Panel, UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { AssetManagerPanelRenderer } from "./AssetManagerPanelRenderer";
import { IsAssetManagerDialogOpenController } from "./AssetManagerSidepanelProps";

export const AssetManagerPanelId = 'asset-manager-panel'; 

export class AssetManagerModule extends UI_Panel {

    constructor(registry: Registry) {
        super(registry, UI_Region.Sidepanel, AssetManagerPanelId, 'Asset Manager');
        
        this.renderer = new AssetManagerPanelRenderer();

        const propControllers = [
            new IsAssetManagerDialogOpenController(registry)
        ];
    
        this.controller = new FormController(this, registry, propControllers);
    }
}