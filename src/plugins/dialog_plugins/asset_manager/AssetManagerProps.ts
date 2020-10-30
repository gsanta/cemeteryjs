import { AssetObj } from '../../../core/models/objs/AssetObj';
import { PropContext, PropController } from '../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../core/plugin/UI_Panel';
import { UI_InputElement } from '../../../core/ui_components/elements/UI_InputElement';
import { AssetManagerDialogPlugin } from './AssetManagerDialogPlugin';

export enum AssetManagerDialogProps {
    DeleteAsset = 'DeleteAsset',
    EnterEditMode = 'EnterEditMode',
    AssetName = 'AssetName',
    AssetPath = 'AssetPath',
    SaveEdit = 'SaveEdit',
    CancelEdit = 'CancelEdit'
}

export class DeleteAssetControl extends PropController<any> {
    acceptedProps() { return [AssetManagerDialogProps.DeleteAsset]; }

    click(context: PropContext, element) {
        const asset = context.registry.stores.assetStore.getAssetById(( <UI_InputElement> element).listItemId);
        context.registry.stores.assetStore.deleteAsset(asset);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class EnterEditModeControl extends PropController<any> {
    acceptedProps() { return [AssetManagerDialogProps.EnterEditMode]; }

    click(context: PropContext, element) {
        const asset = context.registry.stores.assetStore.getAssetById(( <UI_InputElement> element).listItemId);
        (<AssetManagerDialogPlugin> context.panel).editedAsset = asset;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class AssetNameControl extends PropController<any> {
    acceptedProps() { return [AssetManagerDialogProps.AssetName]; }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }

    blur(context: PropContext) {
        (<AssetManagerDialogPlugin> context.panel).tempAssetName = context.getTempVal();
    }

    defaultVal(context: PropContext) {
        return (<AssetManagerDialogPlugin> context.panel).editedAsset.name || '';
    }
}

export class AssetPathControl extends PropController<any> {
    acceptedProps() { return [AssetManagerDialogProps.AssetPath]; }

    change(val: any, context: PropContext<any>) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }

    blur(context: PropContext) {
        (<AssetManagerDialogPlugin> context.panel).tempAssetPath = context.getTempVal();
    }

    defaultVal(context) {
        return (<AssetManagerDialogPlugin> context.plugin).editedAsset.path || '';
    }
}

export class SaveEditControl extends PropController<any> {
    acceptedProps() { return [AssetManagerDialogProps.SaveEdit]; }

    click(context: PropContext<any>) {
        const plugin = (<AssetManagerDialogPlugin> context.panel);
        const editedAsset = (<AssetManagerDialogPlugin> context.panel).editedAsset;

        editedAsset.name = plugin.tempAssetName;
        
        editedAsset.name = plugin.tempAssetPath;

        (<AssetManagerDialogPlugin> context.panel).editedAsset = undefined;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class CancelEditControl extends PropController<any> {
    acceptedProps() { return [AssetManagerDialogProps.CancelEdit]; }

    click(context: PropContext<any>) {

        (<AssetManagerDialogPlugin> context.panel).editedAsset = undefined;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}