import { AbstractController, PropContext } from '../../core/plugins/controllers/AbstractController';
import { Registry } from '../../core/Registry';
import { AssetManagerDialogPlugin } from './AssetManagerDialogPlugin';
import { UI_Region } from '../../core/plugins/UI_Plugin';
import { UI_InputElement } from '../../core/ui_regions/elements/UI_InputElement';

export const AssetManagerDialogControllerId = 'asset_manager_dialog_controller_id';

export enum AssetManagerDialogProps {
    DeleteAsset = 'DeleteAsset',
    EnterEditMode = 'EnterEditMode',
    AssetName = 'AssetName',
    AssetPath = 'AssetPath',
    SaveEdit = 'SaveEdit',
    CancelEdit = 'CancelEdit'
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

        this.createPropHandler<void>(AssetManagerDialogProps.EnterEditMode)
            .onClick((context: PropContext<void>) => {
                const asset = this.registry.stores.assetStore.getAssetById(( <UI_InputElement> context.element).listItemId);
                (<AssetManagerDialogPlugin> this.plugin).editedAsset = asset;
                this.registry.services.render.reRender(UI_Region.Dialog);
            });

        this.createPropHandler<void>(AssetManagerDialogProps.AssetName)
            .onGet((context) => {
                const editedAsset = (<AssetManagerDialogPlugin> this.plugin).editedAsset;

                context.getTempVal(() => editedAsset ? editedAsset.name : '');
            })
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Dialog);
            })

        this.createPropHandler<void>(AssetManagerDialogProps.AssetPath)
            .onGet((context) => {
                const editedAsset = (<AssetManagerDialogPlugin> this.plugin).editedAsset;

                context.getTempVal(() => editedAsset ? editedAsset.path : '');
            })            
            .onChange((val, context) => {
                context.updateTempVal(val);
                this.registry.services.render.reRender(UI_Region.Dialog);
            });

        this.createPropHandler<void>(AssetManagerDialogProps.SaveEdit)
            .onClick(() => {
                const editedAsset = (<AssetManagerDialogPlugin> this.plugin).editedAsset;

                this.getPropHandler<string>(AssetManagerDialogProps.AssetName).context.releaseTempVal(val => editedAsset.name = val);
                this.getPropHandler<string>(AssetManagerDialogProps.AssetPath).context.releaseTempVal(val => editedAsset.path = val);

                (<AssetManagerDialogPlugin> this.plugin).editedAsset = undefined;
                this.registry.services.render.reRender(UI_Region.Dialog);
            });

        this.createPropHandler<void>(AssetManagerDialogProps.CancelEdit)
            .onClick(() => {
                this.getPropHandler<string>(AssetManagerDialogProps.AssetName).context.clearTempVal();
                this.getPropHandler<string>(AssetManagerDialogProps.AssetPath).context.clearTempVal();

                (<AssetManagerDialogPlugin> this.plugin).editedAsset = undefined;
                this.registry.services.render.reRender(UI_Region.Dialog);
            });
    }
}