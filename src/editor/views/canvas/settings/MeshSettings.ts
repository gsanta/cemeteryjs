import { ServiceLocator } from '../../../services/ServiceLocator';
import { CanvasView } from '../CanvasView';
import { AbstractSettings, PropertyType } from "./AbstractSettings";
import { UpdateTask } from '../../../services/UpdateServices';
import { MeshConcept } from '../models/concepts/MeshConcept';
import { Stores } from '../../../stores/Stores';

export enum MeshViewPropType {
    COLOR = 'color',
    MODEL = 'model',
    TEXTURE = 'texture',
    THUMBNAIL = 'thumbnail',
    LAYER = 'layer',
    ROTATION = 'rotation',
    SCALE = 'scale',
    NAME = 'name',
    PATH = 'path',
    IS_MANUAL_CONTROL = 'is_manual_control',
    ANIMATION = 'animation',
    AnimationState = 'animation_state'
}

const propertyTypes = {
    [MeshViewPropType.SCALE]: PropertyType.Number,
    [MeshViewPropType.ROTATION]: PropertyType.Number
};

export class MeshSettings extends AbstractSettings<MeshViewPropType> {
    static type = 'mesh-settings';
    getType() { return MeshSettings.type; }
    meshConcept: MeshConcept;

    private controller: CanvasView;

    isAnimationSectionOpen = false;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(controller: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(propertyTypes);
        this.controller = controller;
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
            case MeshViewPropType.COLOR:
                return this.meshConcept.color;
            case MeshViewPropType.MODEL:
                return this.meshConcept.modelPath;
            case MeshViewPropType.TEXTURE:
                return this.meshConcept.texturePath;
            case MeshViewPropType.THUMBNAIL:
                return this.meshConcept.thumbnailPath;
            case MeshViewPropType.LAYER:
                return this.meshConcept.layer;
            case MeshViewPropType.ROTATION:
                return this.meshConcept.rotation;
            case MeshViewPropType.SCALE:
                return this.meshConcept.scale;
            case MeshViewPropType.NAME:
                return this.meshConcept.name;
            case MeshViewPropType.PATH:
                return this.meshConcept.path;
            case MeshViewPropType.IS_MANUAL_CONTROL:
                return this.meshConcept.isManualControl;
            case MeshViewPropType.ANIMATION:
                return this.meshConcept.activeAnimation;
            case MeshViewPropType.AnimationState:
                return this.meshConcept.animationState;
    
        }
    }

    protected setProp(val: any, prop: MeshViewPropType) {
        switch (prop) {
            case MeshViewPropType.COLOR:
                this.meshConcept.color = val;
                break;
            case MeshViewPropType.MODEL:
                this.meshConcept.modelPath = val.path;
                this.getServices().storageService().saveAsset(val.path, val.data)
                .finally(() => {
                    this.controller.model3dController.setDimensions(this.meshConcept);
                    this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                });
                break;
            case MeshViewPropType.TEXTURE:
                this.meshConcept.texturePath = val.path;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.THUMBNAIL:
                this.meshConcept.thumbnailPath = val.path;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.LAYER:
                this.meshConcept.layer = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.ROTATION:
                this.meshConcept.rotation = this.convertValue(val, prop, this.meshConcept.rotation);
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.SCALE:
                this.meshConcept.scale = this.convertValue(val, prop, this.meshConcept.scale);
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.NAME:
                this.meshConcept.name = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.PATH:
                this.meshConcept.path = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.IS_MANUAL_CONTROL:
                this.meshConcept.isManualControl = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.ANIMATION:
                this.meshConcept.activeAnimation = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer, UpdateTask.SaveData);
                break;
            case MeshViewPropType.AnimationState:
                this.meshConcept.animationState = val;
                this.controller.getGameApi().meshObjectUpdater.updateAnimationState(this.meshConcept.animationState, this.meshConcept.name)
                break;
        }

        const map = this.getServices().exportService().export();
        this.getServices().storageService().storeLevel(this.getStores().levelStore.currentLevel.index, map);
    }
}