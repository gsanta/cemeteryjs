import { AssetModel, AssetType } from '../../../core/models/game_objects/AssetModel';
import { MeshView } from '../../../core/models/views/MeshView';
import { ViewType } from '../../../core/models/views/View';
import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractSettings } from "../../scene_editor/settings/AbstractSettings";
import { MeshImporterPlugin } from '../MeshImporterPlugin';
import { ThumbnailMakerService } from '../services/ThumbnailMakerService';

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

        switch (prop) {
            case ImportSettingsProps.Model:
                const assetModel = new AssetModel({path: val.path, data: val.data, assetType: AssetType.Model});
                meshView.modelId = this.registry.stores.assetStore.addModel(assetModel);
                this.registry.services.localStore.saveAsset(assetModel.getId(), val.data)
                    // .then(() => {
                    //     this.registry.services.thumbnailMaker.createThumbnail(assetModel);
                    //     return this.registry.services.meshLoader.getDimensions(assetModel, this.meshConcept.id);
                    // })
                    // .then(dim => {
                    //     this.meshConcept.dimensions.setWidth(dim.x);
                    //     this.meshConcept.dimensions.setHeight(dim.y);
                    // })
                    // .then(() => this.registry.services.meshLoader.getAnimations(assetModel, this.meshConcept.id))
                    // .then(animations => {
                    //     this.meshConcept.animations = animations;
                    // })
                    // .finally(() => {
                    //     this.registry.services.game.updateConcepts([meshView]);
                    // });

                this.activate();
                this.update(meshView);
                break;
            case ImportSettingsProps.Texture:
                meshView.textureId = this.registry.stores.assetStore.addTexture(new AssetModel({path: val.path, assetType: AssetType.Texture}));
                this.update(meshView);
                break;
            case ImportSettingsProps.Thumbnail:
                meshView.thumbnailId = this.registry.stores.assetStore.addThumbnail(new AssetModel({path: val.path, assetType: AssetType.Thumbnail}));
                this.update(meshView);
                break;
        }
    }

    private update(meshView: MeshView) {
        this.registry.services.history.createSnapshot();
        this.registry.services.update.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);

    }
}