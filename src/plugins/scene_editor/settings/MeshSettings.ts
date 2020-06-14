import { toDegree, toRadian } from '../../../core/geometry/utils/Measurements';
import { MeshView } from '../../../core/models/views/MeshView';
import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractSettings, PropertyType } from "./AbstractSettings";
import { MeshImporterSettings } from '../../mesh_importer/settings/MeshImporterSettings';
import { SceneEditorPlugin } from '../SceneEditorPlugin';
import { AssetModel, AssetType } from '../../../core/models/game_objects/AssetModel';

export enum MeshViewPropType {
    Color = 'color',
    Model = 'model',
    Texture = 'texture',
    Thumbnail = 'thumbnail',
    Layer = 'layer',
    Rotation = 'rotation',
    Scale = 'scale',
    YPos = 'y-pos',
    Name = 'name',
    Path = 'path',
    IsManualControl = 'is-manual-control',
    AnimationState = 'animation-state'
}

const propertyTypes = {
    [MeshViewPropType.Scale]: PropertyType.Number,
    [MeshViewPropType.Rotation]: PropertyType.Number
};

export class MeshSettings extends AbstractSettings<MeshViewPropType> {
    static settingsName = 'mesh-settings';
    getName() { return MeshSettings.settingsName; }
    meshView: MeshView;

    isAnimationSectionOpen = false;
    private registry: Registry;
    private plugin: SceneEditorPlugin;

    constructor(plugin: SceneEditorPlugin, registry: Registry) {
        super(propertyTypes);
        this.plugin = plugin;
        this.registry = registry;
    }

    blurProp() {
        super.blurProp();

        this.registry.services.update.runImmediately(RenderTask.RenderFocusedView);
    }

    updateProp(value: any, propType: MeshViewPropType) {
        super.updateProp(value, propType);

        this.registry.services.update.runImmediately(RenderTask.RenderFocusedView);
    }

    protected getProp(prop: MeshViewPropType) {
        switch (prop) {
            case MeshViewPropType.Color:
                return this.meshView.color;
            case MeshViewPropType.Model:
                return this.registry.stores.assetStore.getAssetById(this.meshView.modelId);
            case MeshViewPropType.Texture:
                return this.registry.stores.assetStore.getAssetById(this.meshView.textureId);
            case MeshViewPropType.Thumbnail:
                return this.registry.stores.assetStore.getAssetById(this.meshView.thumbnailId);
            case MeshViewPropType.Layer:
                return this.meshView.layer;
            case MeshViewPropType.Rotation:
                return Math.round(toDegree(this.meshView.rotation));
            case MeshViewPropType.Scale:
                return this.meshView.scale;
            case MeshViewPropType.YPos:
                return this.meshView.yPos;
            case MeshViewPropType.Name:
                return this.meshView.id;
            case MeshViewPropType.Path:
                return this.meshView.path;
            case MeshViewPropType.IsManualControl:
                return this.meshView.isManualControl;
            case MeshViewPropType.AnimationState:
                return this.meshView.animationState;
    
        }
    }

    protected setProp(val: any, prop: MeshViewPropType) {
        switch (prop) {
            case MeshViewPropType.Color:
                this.meshView.color = val;
                this.update();
                break;
            case MeshViewPropType.Model:
                const assetModel = new AssetModel({path: val.path, data: val.data, assetType: AssetType.Model});
                this.meshView.modelId = this.registry.stores.assetStore.addModel(assetModel);

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
                    .finally(() => {
                        this.registry.services.game.updateConcepts([this.meshView]);
                    });
                
                // TODO should separate concerns
                this.registry.services.plugin.assetImporter.getSettingsByName<MeshImporterSettings>(MeshImporterSettings.settingsName).activate(assetModel);
                break;
            case MeshViewPropType.Texture:
                this.meshView.textureId = this.registry.stores.assetStore.addTexture(new AssetModel({path: val.path, assetType: AssetType.Texture}));
                this.update();
                break;
            case MeshViewPropType.Thumbnail:
                this.meshView.thumbnailId = this.registry.stores.assetStore.addThumbnail(new AssetModel({path: val.path, assetType: AssetType.Thumbnail}));
                this.update();
                break;
            case MeshViewPropType.Layer:
                this.meshView.layer = val;
                this.update();
                break;
            case MeshViewPropType.Rotation:
                this.meshView.rotation = toRadian(this.convertValue(val, prop, this.meshView.rotation));
                this.update();
                break;
            case MeshViewPropType.Scale:
                this.meshView.scale = this.convertValue(val, prop, this.meshView.scale);
                this.update();
                break;
            case MeshViewPropType.YPos:
                this.meshView.yPos = this.convertValue(val, prop, this.meshView.yPos);
                this.update();
                break;
            case MeshViewPropType.Name:
                this.meshView.id = val;
                this.update();
                break;
            case MeshViewPropType.Path:
                this.meshView.path = val;
                this.update();
                break;
            case MeshViewPropType.IsManualControl:
                this.meshView.isManualControl = val;
                this.update();
                break;
            case MeshViewPropType.AnimationState:
                this.meshView.animationState = val;
                this.update();
                break;
        }
    }

    private update() {
        this.registry.services.game.updateConcepts([this.meshView]);
        this.registry.services.history.createSnapshot();
        this.registry.services.update.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);

    }
}