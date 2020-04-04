import { ServiceLocator } from '../../../services/ServiceLocator';
import { AbstractSettings, PropertyType } from "./AbstractSettings";
import { UpdateTask } from '../../../services/UpdateServices';
import { MeshConcept } from '../models/concepts/MeshConcept';
import { Stores } from '../../../stores/Stores';
import { AnimationCondition, AnimationConcept } from '../models/meta/AnimationConcept';
import { ConceptType } from '../models/concepts/Concept';

export enum MeshViewPropType {
    Color = 'color',
    Model = 'model',
    Texture = 'texture',
    Thumbnail = 'thumbnail',
    Layer = 'layer',
    Rotation = 'rotation',
    Scale = 'scale',
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
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super(propertyTypes);
        this.getServices = getServices;
        this.getStores = getStores;
        this.getServices = getServices;
    }

    blurProp() {
        super.blurProp();

        this.getServices().updateService().runImmediately(UpdateTask.RepaintCanvas);
    }

    updateProp(value: any, propType: MeshViewPropType) {
        super.updateProp(value, propType);

        this.getServices().updateService().runImmediately(UpdateTask.RepaintCanvas);
    }

    protected getProp(prop: MeshViewPropType) {
        switch (prop) {
            case MeshViewPropType.Color:
                return this.meshConcept.color;
            case MeshViewPropType.Model:
                return this.meshConcept.modelPath;
            case MeshViewPropType.Texture:
                return this.meshConcept.texturePath;
            case MeshViewPropType.Thumbnail:
                return this.meshConcept.thumbnailPath;
            case MeshViewPropType.Layer:
                return this.meshConcept.layer;
            case MeshViewPropType.Rotation:
                return this.meshConcept.rotation;
            case MeshViewPropType.Scale:
                return this.meshConcept.scale;
            case MeshViewPropType.Name:
                return this.meshConcept.id;
            case MeshViewPropType.Path:
                return this.meshConcept.path;
            case MeshViewPropType.IsManualControl:
                return this.meshConcept.isManualControl;
            case MeshViewPropType.DefaultAnimation:
                if (this.meshConcept.animationId) {
                    return this.getStores().canvasStore.getAnimationConceptById(this.meshConcept.animationId).getAnimationByCond(AnimationCondition.Default);
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
                break;
            case MeshViewPropType.Model:
                this.meshConcept.modelPath = val.path;
                this.getServices().storageService().saveAsset(val.path, val.data)
                .finally(() => {
                    this.getServices().meshDimensionService().setDimensions(this.meshConcept);
                    this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                });
                break;
            case MeshViewPropType.Texture:
                this.meshConcept.texturePath = val.path;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.Thumbnail:
                this.meshConcept.thumbnailPath = val.path;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.Layer:
                this.meshConcept.layer = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.Rotation:
                this.meshConcept.rotation = this.convertValue(val, prop, this.meshConcept.rotation);
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.Scale:
                this.meshConcept.scale = this.convertValue(val, prop, this.meshConcept.scale);
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.Name:
                this.meshConcept.id = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.Path:
                this.meshConcept.path = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.IsManualControl:
                this.meshConcept.isManualControl = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.DefaultAnimation:
                if (val === undefined) {
                    if (this.meshConcept.animationId) {
                        const animationConcept = this.getStores().canvasStore.getAnimationConceptById(this.meshConcept.animationId);
                        this.getStores().canvasStore.removeMeta(animationConcept);
                        this.meshConcept.animationId = undefined;
                    }
                } else {
                    if (!this.meshConcept.animationId) {
                        const animationConcept = new AnimationConcept();
                        animationConcept.id = this.getStores().canvasStore.generateUniqueName(ConceptType.AnimationConcept);
                        this.getStores().canvasStore.addMeta(animationConcept);
                        this.meshConcept.animationId = animationConcept.id;
                
                    }
    
                    this.getStores().canvasStore.getAnimationConceptById(this.meshConcept.animationId).addAnimation({
                        name: val,
                        condition: AnimationCondition.Default
                    })
                }

                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.AnimationState:
                this.meshConcept.animationState = val;
                this.getServices().gameService().meshObjectUpdater.updateAnimationState(this.meshConcept.animationState, this.meshConcept.id)
                break;
        }

        const map = this.getServices().exportService().export();
        this.getServices().storageService().storeLevel(this.getStores().levelStore.currentLevel.index, map);
    }
}