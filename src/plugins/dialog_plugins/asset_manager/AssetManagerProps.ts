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
    click() {
        const asset = this.registry.stores.assetStore.getAssetById(( <UI_InputElement> element).listItemId);
        this.registry.stores.assetStore.deleteAsset(asset);
        this.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class EnterEditModeControl extends PropController<any> {
    editedAsset: AssetObj;

    constructor(registry: Registry) {
        super(registry);
    }

    click() {
        const asset = this.registry.stores.assetStore.getAssetById(( <UI_InputElement> element).listItemId);
        this.editedAsset = asset;
        this.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class AssetNameControl extends PropController<any> {
    private controllers: AssetManagerControllers;
    tempAssetName: string;

    constructor(registry: Registry, controllers: AssetManagerControllers) {
        super(registry);
        this.controllers = controllers;
    }

    change(val: string) {
        this.tempAssetName = val;
        this.registry.services.render.reRender(UI_Region.Dialog);
    }

    val() {
        const editedAsset = this.controllers.enterEditMode.editedAsset;
        if (this.tempAssetName !== undefined) {
            return this.tempAssetName;
        } else if (editedAsset) {
            return editedAsset.name;
        }
    }
}

export class AssetPathControl extends PropController {
    private controllers: AssetManagerControllers;
    tempAssetPath: string;

    constructor(registry: Registry, controllers: AssetManagerControllers) {
        super(registry);
        this.controllers = controllers;
    }

    change(val: any) {
        this.tempAssetPath = val;
        this.registry.services.render.reRender(UI_Region.Dialog);
    }

    val() {
        const editedAsset = this.controllers.enterEditMode.editedAsset;
        if (this.tempAssetPath !== undefined) {
            return this.tempAssetPath;
        } else if (editedAsset) {
            return editedAsset.path;
        }
    }
}

export class SaveEditControl extends PropController<any> {
    private controllers: AssetManagerControllers;

    constructor(registry: Registry, controllers: AssetManagerControllers) {
        super(registry);
        this.controllers = controllers;
    }

    click() {
        const editedAsset = this.controllers.enterEditMode.editedAsset;
        editedAsset.name = this.controllers.assetNameControl.tempAssetName;
        editedAsset.name = this.controllers.assetPathControl.tempAssetPath;

        this.controllers.enterEditMode.editedAsset = undefined;
        this.registry.services.render.reRender(UI_Region.Dialog);
    }
}

export class CancelEditControl extends PropController<any> {
    private controllers: AssetManagerControllers;

    constructor(registry: Registry, controllers: AssetManagerControllers) {
        super(registry);
        this.controllers = controllers;
    }

    click() {
        this.controllers.enterEditMode.editedAsset = undefined;
        this.registry.services.render.reRender(UI_Region.Dialog);
    }
}