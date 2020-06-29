import { Registry } from "../../core/Registry";
import { AbstractSettings } from "../scene_editor/settings/AbstractSettings";
import { AssetManagerPlugin } from "./AssetManagerPlugin";
import { RenderTask } from "../../core/services/RenderServices";
import { AssetModel } from "../../core/models/game_objects/AssetModel";

export enum AssetManagerDialogProps {
    EditedAssetId = 'EditedAssetId',
    EditedAssetPath = 'EditedAssetPath',
    Delete = 'Delete'
}

export class AssetManagerDialogController extends AbstractSettings<AssetManagerDialogProps> {
    static settingsName = 'asset-manager-dialog-controller';
    getName() { return AssetManagerDialogController.settingsName; }

    private registry: Registry;
    private plugin: AssetManagerPlugin;

    private editedAssetModel: AssetModel;

    constructor(plugin: AssetManagerPlugin, registry: Registry) {
        super();
        this.plugin = plugin;
        this.registry = registry;
    }

    open() {
        this.registry.services.dialog.openDialog(this);
    }

    close() {
        this.registry.services.dialog.close();
        this.registry.services.render.runImmediately(RenderTask.RenderFull);
    }

    protected getProp(prop: AssetManagerDialogProps) {
        switch (prop) {
            case AssetManagerDialogProps.EditedAssetId:
                return this.editedAssetModel ? this.editedAssetModel.getId() : undefined;
            case AssetManagerDialogProps.EditedAssetPath:
                return this.editedAssetModel ? this.editedAssetModel.path : '';
        }
    }

    protected async setProp(val: any, prop: AssetManagerDialogProps) {
        switch(prop) {
            case AssetManagerDialogProps.EditedAssetId:
                this.editedAssetModel = this.registry.stores.assetStore.getAssetById(val);
                this.update();
            break;
            case AssetManagerDialogProps.EditedAssetPath:
                if (this.editedAssetModel) {
                    this.editedAssetModel.path = val;
                }

                this.registry.services.render.runImmediately(RenderTask.RenderDialog);
            break;
        }
    }

    private update() {
        this.registry.services.render.runImmediately(RenderTask.RenderFull);
    }
}