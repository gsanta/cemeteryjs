import { ServiceLocator } from '../../../services/ServiceLocator';
import { CanvasView } from '../CanvasView';
import { AbstractForm, PropertyType } from "./AbstractForm";
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

export class MeshForm extends AbstractForm<MeshViewPropType> {
    gameObject: MeshConcept;

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
                return this.gameObject.color;
            case MeshViewPropType.MODEL:
                return this.gameObject.modelPath;
            case MeshViewPropType.TEXTURE:
                return this.gameObject.texturePath;
            case MeshViewPropType.THUMBNAIL:
                return this.gameObject.thumbnailPath;
            case MeshViewPropType.LAYER:
                return this.gameObject.layer;
            case MeshViewPropType.ROTATION:
                return this.gameObject.rotation;
            case MeshViewPropType.SCALE:
                return this.gameObject.scale;
            case MeshViewPropType.NAME:
                return this.gameObject.name;
            case MeshViewPropType.PATH:
                return this.gameObject.path;
            case MeshViewPropType.IS_MANUAL_CONTROL:
                return this.gameObject.isManualControl;
            case MeshViewPropType.ANIMATION:
                return this.gameObject.activeAnimation;
            case MeshViewPropType.AnimationState:
                return this.gameObject.animationState;
    
        }
    }

    protected setProp(val: any, prop: MeshViewPropType) {
        switch (prop) {
            case MeshViewPropType.COLOR:
                this.gameObject.color = val;
                break;
            case MeshViewPropType.MODEL:
                this.gameObject.modelPath = val.path;
                this.getServices().storageService().saveAsset(val.path, val.data)
                .finally(() => {
                    this.controller.model3dController.set3dModelForCanvasItem(this.gameObject);
                    this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer);
                });
                break;
            case MeshViewPropType.TEXTURE:
                this.gameObject.texturePath = val.path;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer);
                break;
            case MeshViewPropType.THUMBNAIL:
                this.gameObject.thumbnailPath = val.path;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer);
                break;
            case MeshViewPropType.LAYER:
                this.gameObject.layer = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer);
                break;
            case MeshViewPropType.ROTATION:
                this.gameObject.rotation = this.convertValue(val, prop, this.gameObject.rotation);
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer);
                break;
            case MeshViewPropType.SCALE:
                this.gameObject.scale = this.convertValue(val, prop, this.gameObject.scale);
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer);
                break;
            case MeshViewPropType.NAME:
                this.gameObject.name = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer);
                break;
            case MeshViewPropType.PATH:
                this.gameObject.path = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer);
                break;
            case MeshViewPropType.IS_MANUAL_CONTROL:
                this.gameObject.isManualControl = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer);
                break;
            case MeshViewPropType.ANIMATION:
                this.gameObject.activeAnimation = val;
                this.getServices().updateService().runImmediately(UpdateTask.UpdateRenderer);
                break;
            case MeshViewPropType.AnimationState:
                this.gameObject.animationState = val;
                this.controller.getGameApi().meshObjectUpdater.updateAnimationState(this.gameObject.animationState, this.gameObject.name)
                break;
        }

        const map = this.getServices().exportService().export();
        this.getServices().storageService().storeLevel(this.getStores().levelStore.currentLevel.index, map);
    }
}