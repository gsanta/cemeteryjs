import { PropContext, PropController } from '../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../core/plugin/UI_Panel';
import { UI_Element } from '../../../core/ui_components/elements/UI_Element';
import { UI_InputElement } from '../../../core/ui_components/elements/UI_InputElement';
import { AssetManagerDialogRenderer } from './AssetManagerDialogRenderer';

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
        const renderer = <AssetManagerDialogRenderer> context.panel.renderer;
        
        renderer.editedAsset = asset;
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
        const renderer = <AssetManagerDialogRenderer> context.panel.renderer;
        
        renderer.tempAssetName = context.getTempVal();
    }

    defaultVal(context: PropContext) {
        const renderer = <AssetManagerDialogRenderer> context.panel.renderer;

        return renderer.editedAsset.name || '';
    }
}

export class AssetPathControl extends PropController<any> {
    acceptedProps() { return [AssetManagerDialogProps.AssetPath]; }

    change(val: any, context: PropContext<any>) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }

    blur(context: PropContext, element: UI_Element) {
        const renderer = <AssetManagerDialogRenderer> context.panel.renderer;
        renderer.tempAssetPath = context.getTempVal();
    }

    defaultVal(context) {
        const renderer = <AssetManagerDialogRenderer> context.panel.renderer;
        return renderer.editedAsset.path || '';
    }
}

export class SaveEditControl extends PropController<any> {
    acceptedProps() { return [AssetManagerDialogProps.SaveEdit]; }

    click(context: PropContext<any>) {
        const renderer = <AssetManagerDialogRenderer> context.panel.renderer;

        const editedAsset = renderer.editedAsset;
        editedAsset.name = renderer.tempAssetName;
        editedAsset.name = renderer.tempAssetPath;

        renderer.editedAsset = undefined;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class CancelEditControl extends PropController<any> {
    acceptedProps() { return [AssetManagerDialogProps.CancelEdit]; }

    click(context: PropContext<any>) {
        const renderer = <AssetManagerDialogRenderer> context.panel.renderer;
        renderer.editedAsset = undefined;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}