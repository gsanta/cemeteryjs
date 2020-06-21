import { AssetModel, AssetType } from '../../../core/models/game_objects/AssetModel';
import { MeshView } from '../../../core/models/views/MeshView';
import { ViewType } from '../../../core/models/views/View';
import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractSettings } from "../../scene_editor/settings/AbstractSettings";
import { MeshImporterPlugin } from '../MeshImporterPlugin';
import { ThumbnailMakerService } from '../services/ThumbnailMakerService';
import { MeshLoaderService } from '../../../core/services/MeshLoaderService';

export enum ImportSettingsProps {
    Model = 'model',
    Texture = 'texture',
    Thumbnail = 'thumbnail'
}

export class MeshImporterSettings extends AbstractSettings<ImportSettingsProps> {
    static settingsName = 'mesh-importer-settings';
    getName() { return MeshImporterSettings.settingsName; }

    private registry: Registry;
    private plugin: MeshImporterPlugin;

    constructor(plugin: MeshImporterPlugin, registry: Registry) {
        super();
        this.plugin = plugin;
        this.registry = registry;
    }

    activate() {
        this.registry.services.dialog.openDialog(MeshImporterSettings.settingsName);
        this.plugin.pluginServices.byName<ThumbnailMakerService>(ThumbnailMakerService.serviceName).loadSelectedMeshView();
    }

    close() {
        this.registry.services.history.createSnapshot();
        this.registry.services.dialog.close();
        this.registry.services.update.runImmediately(RenderTask.RenderFull);
    }

    protected getProp(prop: ImportSettingsProps) {
        const meshView = this.registry.stores.selectionStore.hasOne() && this.registry.stores.selectionStore.getOneByType(ViewType.MeshView) as MeshView;

        switch (prop) {
            case ImportSettingsProps.Model:
                return meshView && this.registry.stores.assetStore.getAssetById(meshView.modelId);
            case ImportSettingsProps.Texture:
                return meshView && this.registry.stores.assetStore.getAssetById(meshView.textureId);
            case ImportSettingsProps.Thumbnail:
                return meshView && this.registry.stores.assetStore.getAssetById(meshView.thumbnailId);
        }
    }

    protected setProp(val: any, prop: ImportSettingsProps) {
        const meshView = this.registry.stores.selectionStore.hasOne() && this.registry.stores.selectionStore.getOneByType(ViewType.MeshView) as MeshView;

        let assetModel: AssetModel;
        switch (prop) {
            case ImportSettingsProps.Model:
                assetModel = new AssetModel({path: val.path, data: val.data, assetType: AssetType.Model});
                meshView.modelId = this.registry.stores.assetStore.addModel(assetModel);
                this.registry.services.localStore.saveAsset(assetModel);
                this.registry.stores.meshStore.deleteInstance((<MeshView> meshView).mesh);
                this.registry.stores.meshStore.createInstance(meshView.model);
                const meshLoaderService = this.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName);

                 meshLoaderService.getDimensions(assetModel, meshView.id)
                .then(dim => {
                    meshView.dimensions.setWidth(dim.x);
                    meshView.dimensions.setHeight(dim.y);
                    this.update(meshView);
                });

                this.activate();
                break;
            case ImportSettingsProps.Texture:
                assetModel = new AssetModel({path: val.path, data: val.data, assetType: AssetType.Texture})
                meshView.textureId = this.registry.stores.assetStore.addTexture(assetModel);
                this.registry.services.localStore.saveAsset(assetModel);
                this.registry.stores.meshStore.createMaterial(meshView.model);
                this.update(meshView);
                break;
        }
    }

    private update(meshView: MeshView) {
        this.registry.services.history.createSnapshot();
        this.registry.services.update.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);

    }
}