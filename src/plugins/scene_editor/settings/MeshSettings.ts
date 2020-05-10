import { Registry } from '../../../editor/Registry';
import { UpdateTask } from '../../../core/services/UpdateServices';
import { ConceptType } from '../../../editor/models/concepts/Concept';
import { MeshConcept } from '../../../editor/models/concepts/MeshConcept';
import { ModelConcept } from '../../../editor/models/concepts/ModelConcept';
import { AnimationConcept, AnimationCondition } from '../../../editor/models/meta/AnimationConcept';
import { AbstractSettings, PropertyType } from "./AbstractSettings";
import { toDegree, toRadian } from '../../../misc/geometry/utils/Measurements';

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
    DefaultAnimation = 'default-animation',
    AnimationState = 'animation-state'
}

const propertyTypes = {
    [MeshViewPropType.Scale]: PropertyType.Number,
    [MeshViewPropType.Rotation]: PropertyType.Number
};

export class MeshSettings extends AbstractSettings<MeshViewPropType> {
    static type = 'mesh-settings';
    getName() { return MeshSettings.type; }
    meshConcept: MeshConcept;

    isAnimationSectionOpen = false;
    private registry: Registry;

    constructor(registry: Registry) {
        super(propertyTypes);
        this.registry = registry;
    }

    blurProp() {
        super.blurProp();

        this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
    }

    updateProp(value: any, propType: MeshViewPropType) {
        super.updateProp(value, propType);

        this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
    }

    protected getProp(prop: MeshViewPropType) {
        let modelConcept = this.registry.stores.canvasStore.getModelConceptById(this.meshConcept.modelId);
        switch (prop) {
            case MeshViewPropType.Color:
                return this.meshConcept.color;
            case MeshViewPropType.Model:
                return modelConcept && modelConcept.modelPath;
            case MeshViewPropType.Texture:
                return modelConcept && modelConcept.texturePath;
            case MeshViewPropType.Thumbnail:
                return this.meshConcept.thumbnailPath;
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
            case MeshViewPropType.DefaultAnimation:
                if (this.meshConcept.animationId) {
                    return this.registry.stores.canvasStore.getAnimationConceptById(this.meshConcept.animationId).getAnimationByCond(AnimationCondition.Default);
                }
                break;
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
                this.updateModelPath(val.path);
                const modelConcept = this.registry.stores.canvasStore.getModelConceptById(this.meshConcept.modelId);

                this.registry.services.storage.saveAsset(val.path, val.data)
                    .then(() => {
                        return this.registry.services.meshLoader.getDimensions(modelConcept, this.meshConcept.id);
                    })
                    .then(dim => {
                        this.meshConcept.dimensions.setWidth(dim.x);
                        this.meshConcept.dimensions.setHeight(dim.y);
                    })
                    .then(() => this.registry.services.meshLoader.getAnimations(modelConcept, this.meshConcept.id))
                    .then(animations => {
                        this.meshConcept.animations = animations;
                    })
                    .finally(() => {
                        const data = this.registry.services.export.export();
                        this.registry.services.game.updateConcepts([this.meshConcept]);
                        this.registry.services.update.runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData, UpdateTask.RepaintCanvas);
                        this.registry.services.storage.storeLevel(this.registry.stores.levelStore.currentLevel.index, data);
                    });
                break;
            case MeshViewPropType.Texture:
                this.updateTexturePath(val.path);
                this.update();
                break;
            case MeshViewPropType.Thumbnail:
                this.meshConcept.thumbnailPath = val.path;
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
            case MeshViewPropType.DefaultAnimation:
                if (val === undefined) {
                    if (this.meshConcept.animationId) {
                        const animationConcept = this.registry.stores.canvasStore.getAnimationConceptById(this.meshConcept.animationId);
                        this.registry.stores.canvasStore.removeMeta(animationConcept);
                        this.meshConcept.animationId = undefined;
                    }
                } else {
                    if (!this.meshConcept.animationId) {
                        const animationConcept = new AnimationConcept();
                        animationConcept.id = this.registry.stores.canvasStore.generateUniqueName(ConceptType.AnimationConcept);
                        this.registry.stores.canvasStore.addMeta(animationConcept);
                        this.meshConcept.animationId = animationConcept.id;
                
                    }
    
                    this.registry.stores.canvasStore.getAnimationConceptById(this.meshConcept.animationId).addAnimation({
                        name: val,
                        condition: AnimationCondition.Default
                    })
                }
                this.update();
                break;
            case MeshViewPropType.AnimationState:
                this.meshConcept.animationState = val;
                this.update();
                break;
        }
    }

    private updateModelPath(path: string) {
        let modelConcept = ModelConcept.getByModelPath(this.registry.stores.canvasStore.getModelConcepts(), path);
        if (!modelConcept) {
            modelConcept = new ModelConcept();
            modelConcept.id = this.registry.stores.canvasStore.generateUniqueName(ConceptType.ModelConcept);
            this.registry.stores.canvasStore.addMeta(modelConcept);
        }
        modelConcept.modelPath = path;
        this.meshConcept.modelId = modelConcept.id;
    }

    private updateTexturePath(path: string) {
        let modelConcept: ModelConcept;
        if (this.meshConcept.modelId) {
            modelConcept = this.registry.stores.canvasStore.getModelConceptById(this.meshConcept.modelId);
        } else {
            modelConcept = new ModelConcept();
            modelConcept.id = this.registry.stores.canvasStore.generateUniqueName(ConceptType.ModelConcept);
            this.registry.stores.canvasStore.addMeta(modelConcept);
        }
        modelConcept.texturePath = path;
        this.meshConcept.modelId = modelConcept.id;   
    }

    private update() {
        const data = this.registry.services.export.export();
        this.registry.services.game.updateConcepts([this.meshConcept]);
        this.registry.services.update.runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
        this.registry.services.storage.storeLevel(this.registry.stores.levelStore.currentLevel.index, data);

    }
}