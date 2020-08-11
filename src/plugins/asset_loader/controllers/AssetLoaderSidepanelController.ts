import { AssetModel, AssetType } from '../../../core/stores/game_objects/AssetModel';
import { MeshView } from '../../../core/stores/views/MeshView';
import { ViewType } from '../../../core/stores/views/View';
import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractSettings } from "../../scene_editor/settings/AbstractSettings";
import { AssetLoaderPlugin } from '../AssetLoaderPlugin';
import { MeshLoaderService } from '../../../core/services/MeshLoaderService';
import { AssetLoaderDialogController } from './AssetLoaderDialogController';
import { UI_Region } from '../../../core/plugins/UI_Plugin';

export enum AssetLoaderSidepanelControllerProps {
    Model = 'Model',
    Texture = 'Texture'
}

export class AssetLoaderSidepanelController extends AbstractSettings<AssetLoaderSidepanelControllerProps> {
    static settingsName = 'asset-loader-sidepanel-controller';
    getName() { return AssetLoaderSidepanelController.settingsName; }

    private registry: Registry;
    private plugin: AssetLoaderPlugin;

    constructor(plugin: AssetLoaderPlugin, registry: Registry) {
        super();
        this.plugin = plugin;
        this.registry = registry;
    }

    activate() {
        this.registry.services.dialog.openDialog(this.plugin.pluginSettings.dialogController);
    }

    close() {
        this.registry.services.history.createSnapshot();
        this.registry.services.dialog.close();
        this.registry.services.render.reRenderAll();
    }

    protected getProp(prop: AssetLoaderSidepanelControllerProps) {
        const meshView = this.registry.stores.selectionStore.hasOne() && this.registry.stores.selectionStore.getOneByType(ViewType.MeshView) as MeshView;

        switch (prop) {
            case AssetLoaderSidepanelControllerProps.Model:
                return meshView && this.registry.stores.assetStore.getAssetById(meshView.modelId);
            case AssetLoaderSidepanelControllerProps.Texture:
                return meshView && this.registry.stores.assetStore.getAssetById(meshView.textureId);
        }
    }

    protected setProp(val: any, prop: AssetLoaderSidepanelControllerProps) {
        const meshView = this.registry.stores.selectionStore.hasOne() && this.registry.stores.selectionStore.getOneByType(ViewType.MeshView) as MeshView;

        let assetModel: AssetModel;
        switch (prop) {
            case AssetLoaderSidepanelControllerProps.Model:
                assetModel = new AssetModel({data: val.data, assetType: AssetType.Model});
                meshView.modelId = this.registry.stores.assetStore.addModel(assetModel);
                this.registry.services.localStore.saveAsset(assetModel);
                this.registry.stores.meshStore.deleteInstance((<MeshView> meshView).mesh);
                this.registry.stores.meshStore.createInstance(meshView.model);
                const meshLoaderService = this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);

                 meshLoaderService.getDimensions(assetModel, meshView.id)
                .then(dim => {
                    meshView.dimensions.setWidth(dim.x);
                    meshView.dimensions.setHeight(dim.y);
                    this.update();
                });

                this.plugin.pluginSettings.byName<AssetLoaderDialogController>(AssetLoaderDialogController.settingsName).open();
                break;
            case AssetLoaderSidepanelControllerProps.Texture:
                assetModel = new AssetModel({data: val.data, assetType: AssetType.Texture})
                meshView.textureId = this.registry.stores.assetStore.addTexture(assetModel);
                this.registry.services.localStore.saveAsset(assetModel);
                this.registry.stores.meshStore.createMaterial(meshView.model);
                this.update();
                break;
        }
    }

    private update() {
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }
}