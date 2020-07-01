import { Registry } from "../../core/Registry";
import { AbstractSettings } from "../scene_editor/settings/AbstractSettings";
import { AssetManagerPlugin } from "./AssetManagerPlugin";
import { RenderTask } from "../../core/services/RenderServices";
import { AssetModel } from "../../core/models/game_objects/AssetModel";

export enum AssetManagerDialogProps {
    Edit = 'EditedAssetId',
    EditedAssetPath = 'EditedAssetPath',
    Delete = 'Delete'
}

export class AssetManagerDialogController extends AbstractSettings<AssetManagerDialogProps> {
    static settingsName = 'asset-manager-dialog-controller';
    getName() { return AssetManagerDialogController.settingsName; }

    private registry: Registry;
    private plugin: AssetManagerPlugin;

    private editedAssetModel: AssetModel;
    private editedPath: string;

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
            case AssetManagerDialogProps.EditedAssetPath:
                this.editedAssetModel.path = this.editedPath;
                this.editedPath = undefined;
                this.registry.services.localStore.saveAsset(this.editedAssetModel);
            break;
        }

        this.focusedPropType = null;
        this.registry.services.render.runImmediately(RenderTask.RenderFull);
    }

    protected getProp(prop: AssetManagerDialogProps) {
        switch (prop) {
            case AssetManagerDialogProps.Edit:
                return this.editedAssetModel ? this.editedAssetModel.id : undefined;
            case AssetManagerDialogProps.EditedAssetPath:
                return this.editedPath ? this.editedPath : this.editedAssetModel ? this.editedAssetModel.path : '';
        }
    }

    protected async setProp(val: any, prop: AssetManagerDialogProps) {
        switch(prop) {
            case AssetManagerDialogProps.Edit:
                this.editedAssetModel = this.registry.stores.assetStore.getAssetById(val);
                this.editedPath = this.editedAssetModel.path;
                this.update();
            break;
            case AssetManagerDialogProps.EditedAssetPath:
                this.editedPath = val;
                this.registry.services.render.runImmediately(RenderTask.RenderDialog);
            break;
            case AssetManagerDialogProps.Delete:
                const assetModel = this.registry.stores.assetStore.getAssetById(val);
                this.registry.stores.assetStore.deleteAsset(assetModel);
                this.registry.services.render.runImmediately(RenderTask.RenderFull);
            break;
        }
    }

    private update() {
        this.registry.services.render.runImmediately(RenderTask.RenderFull);
    }
}