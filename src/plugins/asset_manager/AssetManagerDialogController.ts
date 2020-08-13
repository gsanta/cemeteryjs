import { AbstractController, PropContext } from '../../core/plugins/controllers/AbstractController';
import { Registry } from '../../core/Registry';
import { AssetManagerDialogPlugin } from './AssetManagerDialogPlugin';
import { UI_Region } from '../../core/plugins/UI_Plugin';
import { UI_InputElement } from '../../core/ui_regions/elements/UI_InputElement';


export const AssetManagerDialogControllerId = 'asset_manager_dialog_controller_id';

export enum AssetManagerDialogProps {
    DeleteAsset = 'DeleteAsset'
}

export class AssetManagerDialogController extends AbstractController<{}> {
    id = AssetManagerDialogControllerId;

    constructor(plugin: AssetManagerDialogPlugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<void>(AssetManagerDialogProps.DeleteAsset)
            .onClick((context: PropContext<void>) => {
                const asset = this.registry.stores.assetStore.getAssetById(( <UI_InputElement> context.element).listItemId);
                this.registry.stores.assetStore.deleteAsset(asset);
                this.registry.services.render.reRender(UI_Region.Dialog);
            });
    }
}