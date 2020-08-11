import { Registry } from "../../core/Registry";
import { AbstractSettings } from "../scene_editor/settings/AbstractSettings";
import { AssetManagerPlugin } from "./AssetManagerPlugin";
import { AssetModel } from "../../core/stores/game_objects/AssetModel";
import { AssetManagerDialogPluginId } from "./AssetManagerDialogPlugin";
import { UI_Region } from "../../core/UI_Plugin";

export enum AssetManagerDialogProps {
    EditedAsset = 'EditedAsset',
    AssetPath = 'AssetPath',
    AssetName = 'AssetName',
    Delete = 'Delete',
    IsDialogOpen = 'IsDialogOpen'
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
        this.registry.services.render.reRenderAll();

        this.addPropSetter(AssetManagerDialogProps.EditedAsset, (val) => {
            this.editedAssetModel = this.registry.stores.assetStore.getAssetById(val);
            this.editedPath = this.editedAssetModel.path;
            this.editedName = this.editedAssetModel.name
            this.update();
        });
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
        this.registry.services.render.reRenderAll();
    }

    protected getProp(prop: AssetManagerDialogProps) {
        switch (prop) {
            case AssetManagerDialogProps.EditedAsset:
                return this.editedAssetModel;
            case AssetManagerDialogProps.AssetPath:
                return this.editedPath ? this.editedPath : this.editedAssetModel ? this.editedAssetModel.path : '';
            case AssetManagerDialogProps.AssetName:
                return this.editedName ? this.editedName : this.editedAssetModel ? this.editedAssetModel.name : '';
            // case AssetManagerDialogProps.IsDialogOpen:
                // const settings = this.plugin.pluginSettings.dialogController as AssetManagerDialogController;

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
                this.registry.services.render.reRender(UI_Region.Dialog);
            break;
            case AssetManagerDialogProps.Delete:
                const assetModel = this.registry.stores.assetStore.getAssetById(val);
                this.registry.stores.assetStore.deleteAsset(assetModel);
                this.registry.services.render.reRenderAll();
            break;
            case AssetManagerDialogProps.AssetName:
                this.editedName = val;
                this.registry.services.render.reRender(UI_Region.Dialog);
            break;
            case AssetManagerDialogProps.IsDialogOpen:
                if (val) {
                    this.registry.plugins.activatePlugin(AssetManagerDialogPluginId);
                } else {
                    this.registry.plugins.deactivatePlugin(AssetManagerDialogPluginId);
                }
                this.registry.services.ui.runUpdate(UI_Region.Dialog);
            break;
        }
    }

    private update() {
        this.registry.services.render.reRenderAll();
    }
}