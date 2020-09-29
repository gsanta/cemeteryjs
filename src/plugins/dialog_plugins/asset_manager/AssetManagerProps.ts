import { PropContext, PropController } from '../../../core/plugin/controller/AbstractController';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
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
    constructor() {
        super(AssetManagerDialogProps.DeleteAsset);
    }

    click(context, element) {
        const asset = context.registry.stores.assetStore.getAssetById(( <UI_InputElement> element).listItemId);
        context.registry.stores.assetStore.deleteAsset(asset);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class EnterEditModeControl extends PropController<any> {
    constructor() {
        super(AssetManagerDialogProps.EnterEditMode);
    }

    click(context, element) {
        const asset = context.registry.stores.assetStore.getAssetById(( <UI_InputElement> element).listItemId);
        (<AssetManagerDialogPlugin> context.plugin).editedAsset = asset;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class AssetNameControl extends PropController<any> {
    constructor() {
        super(AssetManagerDialogProps.AssetName);
    }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }

    defaultVal(context) {
        return (<AssetManagerDialogPlugin> context.plugin).editedAsset.name || '';
    }
}

export class AssetPathControl extends PropController<any> {
    constructor() {
        super(AssetManagerDialogProps.AssetPath);
    }

    change(val: any, context: PropContext<any>) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }

    defaultVal(context) {
        return (<AssetManagerDialogPlugin> context.plugin).editedAsset.path || '';
    }
}

export class SaveEditControl extends PropController<any> {
    constructor() {
        super(AssetManagerDialogProps.SaveEdit);
    }

    click(context: PropContext<any>) {
        const editedAsset = (<AssetManagerDialogPlugin> context.plugin).editedAsset;

        editedAsset.name = context.controller.getPropContext<string>(AssetManagerDialogProps.AssetName).getTempVal();
        context.controller.getPropContext<string>(AssetManagerDialogProps.AssetName).clearTempVal();
        
        editedAsset.name = context.controller.getPropContext<string>(AssetManagerDialogProps.AssetName).getTempVal();
        context.controller.getPropContext<string>(AssetManagerDialogProps.AssetName).clearTempVal();

        (<AssetManagerDialogPlugin> context.plugin).editedAsset = undefined;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class CancelEditControl extends PropController<any> {
    constructor() {
        super(AssetManagerDialogProps.CancelEdit);
    }

    click(context: PropContext<any>) {
        context.controller.getPropContext<string>(AssetManagerDialogProps.AssetName).clearTempVal();
        context.controller.getPropContext<string>(AssetManagerDialogProps.AssetName).clearTempVal();

        (<AssetManagerDialogPlugin> context.plugin).editedAsset = undefined;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}