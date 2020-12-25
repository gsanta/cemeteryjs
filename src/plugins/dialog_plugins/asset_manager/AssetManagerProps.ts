import { AssetObj } from '../../../core/models/objs/AssetObj';
import { ParamControllers, PropContext, PropController } from '../../../core/plugin/controller/FormController';
import { UI_Region } from '../../../core/plugin/UI_Panel';
import { Registry } from '../../../core/Registry';
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

export class AssetManagerControllers extends ParamControllers {

    constructor(registry: Registry) {
        super();
        
        this.deleteAsset = new DeleteAssetControl(registry);
        this.enterEditMode = new EnterEditModeControl(registry);
        this.assetNameControl = new AssetNameControl(registry, this);
        this.assetPathControl = new AssetPathControl(registry, this);
        this.saveEditControl = new SaveEditControl(registry, this);
        this.cancelEditControl = new CancelEditControl(registry, this);
    }

    deleteAsset: DeleteAssetControl;
    enterEditMode: EnterEditModeControl;
    assetNameControl: AssetNameControl;
    assetPathControl: AssetPathControl;
    saveEditControl: SaveEditControl;
    cancelEditControl: CancelEditControl;
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
    editedAsset: AssetObj;

    constructor(registry: Registry) {
        super(registry);
    }

    acceptedProps() { return [AssetManagerDialogProps.EnterEditMode]; }

    click(context: PropContext, element) {
        const asset = context.registry.stores.assetStore.getAssetById(( <UI_InputElement> element).listItemId);
        this.editedAsset = asset;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class AssetNameControl extends PropController<any> {
    private controllers: AssetManagerControllers;
    tempAssetName: string;

    constructor(registry: Registry, controllers: AssetManagerControllers) {
        super(registry);
        this.controllers = controllers;
    }

    acceptedProps() { return [AssetManagerDialogProps.AssetName]; }

    change(val, context) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }

    blur(context: PropContext) {
        this.tempAssetName = context.getTempVal();
    }

    defaultVal(context: PropContext) {
        return this.controllers.enterEditMode.editedAsset ? this.controllers.enterEditMode.editedAsset.name  : '';
    }
}

export class AssetPathControl extends PropController<any> {
    private controllers: AssetManagerControllers;
    tempAssetPath: string;

    constructor(registry: Registry, controllers: AssetManagerControllers) {
        super(registry);
        this.controllers = controllers;
    }

    acceptedProps() { return [AssetManagerDialogProps.AssetPath]; }

    change(val: any, context: PropContext<any>) {
        context.updateTempVal(val);
        context.registry.services.render.reRender(UI_Region.Dialog);
    }

    blur(context: PropContext, element: UI_Element) {
        this.tempAssetPath = context.getTempVal();
    }

    defaultVal(context) {
        const renderer = <AssetManagerDialogRenderer> context.panel.renderer;
        return this.controllers.enterEditMode.editedAsset ? this.controllers.enterEditMode.editedAsset.path  : '';
    }
}

export class SaveEditControl extends PropController<any> {
    private controllers: AssetManagerControllers;

    constructor(registry: Registry, controllers: AssetManagerControllers) {
        super(registry);
        this.controllers = controllers;
    }

    acceptedProps() { return [AssetManagerDialogProps.SaveEdit]; }

    click(context: PropContext<any>) {
        const editedAsset = this.controllers.enterEditMode.editedAsset;
        editedAsset.name = this.controllers.assetNameControl.tempAssetName;
        editedAsset.name = this.controllers.assetPathControl.tempAssetPath;

        this.controllers.enterEditMode.editedAsset = undefined;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class CancelEditControl extends PropController<any> {
    private controllers: AssetManagerControllers;

    constructor(registry: Registry, controllers: AssetManagerControllers) {
        super(registry);
        this.controllers = controllers;
    }

    acceptedProps() { return [AssetManagerDialogProps.CancelEdit]; }

    click(context: PropContext<any>) {
        this.controllers.enterEditMode.editedAsset = undefined;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}