import { Registry } from "../../core/Registry";
import { AbstractSettings } from "../scene_editor/settings/AbstractSettings";
import { AssetManagerPlugin } from "./AssetManagerPlugin";
import { RenderTask } from "../../core/services/RenderServices";
import { AssetModel } from "../../core/models/game_objects/AssetModel";

export enum AssetManagerDialogProps {
    EditedAsset = 'EditedAsset',
    AssetPath = 'AssetPath',
    AssetName = 'AssetName',
    Delete = 'Delete'
}

export class AssetManagerDialogController extends AbstractSettings<AssetManagerDialogProps> {
    static settingsName = 'asset-manager-dialog-controller';
    getName() { return AssetManagerDialogController.settingsName; }

    private registry: Registry;
    private plugin: AssetManagerPlugin;

    private editedAssetModel: AssetModel;
    private editedPath: string;
    private editedName: string;

    constructor(plugin: AssetManagerPlugin, registry: Registry) {
        super();
        this.plugin = plugin;
        this.registry = registry;
    }

    open() {
        this.registry.services.dialog.openDialog(this);
    }

    close() {
        this.editedAssetModel = undefined;
        this.editedPath = undefined;
        this.registry.services.dialog.close();
        this.registry.services.render.runImmediately(RenderTask.RenderFull);
    }

    blurProp() {
        switch(this.focusedPropType) {
            case AssetManagerDialogProps.AssetPath:
                this.editedAssetModel.path = this.editedPath;
                this.editedPath = undefined;
                this.registry.services.localStore.saveAsset(this.editedAssetModel);
            break;
            case AssetManagerDialogProps.AssetName:
                this.editedAssetModel.name = this.editedName;
                this.editedName = undefined;
                this.registry.services.localStore.saveAsset(this.editedAssetModel);
            break;
        }

        this.focusedPropType = null;
        this.registry.services.render.runImmediately(RenderTask.RenderFull);
    }

    protected getProp(prop: AssetManagerDialogProps) {
        switch (prop) {
            case AssetManagerDialogProps.EditedAsset:
                return this.editedAssetModel;
            case AssetManagerDialogProps.AssetPath:
                return this.editedPath ? this.editedPath : this.editedAssetModel ? this.editedAssetModel.path : '';
            case AssetManagerDialogProps.AssetName:
                return this.editedName ? this.editedName : this.editedAssetModel ? this.editedAssetModel.name : '';    
        }
    }

    protected async setProp(val: any, prop: AssetManagerDialogProps) {
        switch(prop) {
            case AssetManagerDialogProps.EditedAsset:
                this.editedAssetModel = this.registry.stores.assetStore.getAssetById(val);
                this.editedPath = this.editedAssetModel.path;
                this.editedName = this.editedAssetModel.name
                this.update();
            break;
            case AssetManagerDialogProps.AssetPath:
                this.editedPath = val;
                this.registry.services.render.runImmediately(RenderTask.RenderDialog);
            break;
            case AssetManagerDialogProps.Delete:
                const assetModel = this.registry.stores.assetStore.getAssetById(val);
                this.registry.stores.assetStore.deleteAsset(assetModel);
                this.registry.services.render.runImmediately(RenderTask.RenderFull);
            break;
            case AssetManagerDialogProps.AssetName:
                this.editedName = val;
                this.registry.services.render.runImmediately(RenderTask.RenderDialog);

            break;
        }
    }

    private update() {
        this.registry.services.render.runImmediately(RenderTask.RenderFull);
    }
}