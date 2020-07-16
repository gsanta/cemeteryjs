import { AbstractController } from "../scene_editor/settings/AbstractController";
import { Registry } from "../../core/Registry";
import { AssetManagerDialogPluginId } from "./AssetManagerDialogPlugin";

export enum AssetManagerSidepanelControllerProps {
    IsAssetManagerDialogOpen = 'IsAssetManagerDialogOpen'
}

export class AssetManagerSidepanelController extends AbstractController<AssetManagerSidepanelControllerProps> {
    
    constructor(registry: Registry) {
        super(registry);

        this.createPropHandler<number>(AssetManagerSidepanelControllerProps.IsAssetManagerDialogOpen)
            .onClick((val) => {
                this.registry.services.plugin.showPlugin(AssetManagerDialogPluginId);
            });
    }
}
