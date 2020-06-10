import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { MeshView } from '../../../core/models/views/MeshView';
import { AbstractSettings, PropertyType } from "./AbstractSettings";
import { toDegree, toRadian } from '../../../core/geometry/utils/Measurements';
import { ConceptType } from '../../../core/models/views/View';
import { AssetModel, AssetType } from '../../../core/stores/AssetStore';

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
    static type = 'mesh-settings';
    getName() { return MeshSettings.type; }
    meshConcept: MeshView;

    isAnimationSectionOpen = false;
    private registry: Registry;

    constructor(registry: Registry) {
        super(propertyTypes);
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
                return this.meshConcept.color;
            case MeshViewPropType.Model:
                return this.registry.stores.assetStore.getAssetById(this.meshConcept.modelId);
            case MeshViewPropType.Texture:
                return this.registry.stores.assetStore.getAssetById(this.meshConcept.textureId);
            case MeshViewPropType.Thumbnail:
                return this.registry.stores.assetStore.getAssetById(this.meshConcept.thumbnailId);
            case MeshViewPropType.Layer:
                return this.meshConcept.layer;
            case MeshViewPropType.Rotation:
                return Math.round(toDegree(this.meshConcept.rotation));
            case MeshViewPropType.Scale:
                return this.meshConcept.scale;
            case MeshViewPropType.YPos:
                return this.meshConcept.yPos;
            case MeshViewPropType.Name:
                return this.meshConcept.id;
            case MeshViewPropType.Path:
                return this.meshConcept.path;
            case MeshViewPropType.IsManualControl:
                return this.meshConcept.isManualControl;
            case MeshViewPropType.AnimationState:
                return this.meshConcept.animationState;
    
        }
    }

    protected setProp(val: any, prop: MeshViewPropType) {
        switch (prop) {
            case MeshViewPropType.Color:
                this.meshConcept.color = val;
                this.update();
                break;
            case MeshViewPropType.Model:
                const assetModel = new AssetModel({path: val.path, data: val.data, assetType: AssetType.Model});
                this.meshConcept.modelId = this.registry.stores.assetStore.addModel(assetModel);

                this.registry.services.localStore.saveAsset(assetModel.getId(), val.data)
                    .then(() => {
                        this.registry.services.thumbnailMaker.createThumbnail(assetModel);
                        return this.registry.services.meshLoader.getDimensions(assetModel, this.meshConcept.id);
                    })
                    .then(dim => {
                        this.meshConcept.dimensions.setWidth(dim.x);
                        this.meshConcept.dimensions.setHeight(dim.y);
                    })
                    .then(() => this.registry.services.meshLoader.getAnimations(assetModel, this.meshConcept.id))
                    .then(animations => {
                        this.meshConcept.animations = animations;
                    })
                    .finally(() => {
                        this.registry.services.game.updateConcepts([this.meshConcept]);
                        this.registry.services.history.createSnapshot();
                        this.registry.services.update.runImmediately(RenderTask.RenderFull);
                    });
                break;
            case MeshViewPropType.Texture:
                this.meshConcept.textureId = this.registry.stores.assetStore.addTexture(new AssetModel({path: val.path, assetType: AssetType.Texture}));
                this.update();
                break;
            case MeshViewPropType.Thumbnail:
                this.meshConcept.thumbnailId = this.registry.stores.assetStore.addThumbnail(new AssetModel({path: val.path, assetType: AssetType.Thumbnail}));
                this.update();
                break;
            case MeshViewPropType.Layer:
                this.meshConcept.layer = val;
                this.update();
                break;
            case MeshViewPropType.Rotation:
                this.meshConcept.rotation = toRadian(this.convertValue(val, prop, this.meshConcept.rotation));
                this.update();
                break;
            case MeshViewPropType.Scale:
                this.meshConcept.scale = this.convertValue(val, prop, this.meshConcept.scale);
                this.update();
                break;
            case MeshViewPropType.YPos:
                this.meshConcept.yPos = this.convertValue(val, prop, this.meshConcept.yPos);
                this.update();
                break;
            case MeshViewPropType.Name:
                this.meshConcept.id = val;
                this.update();
                break;
            case MeshViewPropType.Path:
                this.meshConcept.path = val;
                this.update();
                break;
            case MeshViewPropType.IsManualControl:
                this.meshConcept.isManualControl = val;
                this.update();
                break;
            case MeshViewPropType.AnimationState:
                this.meshConcept.animationState = val;
                this.update();
                break;
        }
    }

    private update() {
        this.registry.services.game.updateConcepts([this.meshConcept]);
        this.registry.services.history.createSnapshot();
        this.registry.services.update.runImmediately(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);

    }
}