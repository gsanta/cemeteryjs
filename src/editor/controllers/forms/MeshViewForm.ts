import { MeshView } from '../../../common/views/MeshView';
import { CanvasController } from '../../canvas/CanvasController';
import { EventDispatcher } from '../events/EventDispatcher';
import { Events } from '../events/Events';
import { AbstractForm, PropertyType } from "./AbstractForm";

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

export class MeshViewForm extends AbstractForm<MeshViewPropType> {
    gameObject: MeshView;

    private controller: CanvasController;
    private eventDispatcher: EventDispatcher;

    isAnimationSectionOpen = false;

    constructor(controller: CanvasController, eventDispatcher: EventDispatcher) {
        super(propertyTypes);
        this.controller = controller;
        this.eventDispatcher = eventDispatcher;
    }

    blurProp() {
        super.blurProp();

        this.controller.renderWindow();
        // this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
    }

    updateProp(value: any, propType: MeshViewPropType) {
        super.updateProp(value, propType);

        this.controller.renderWindow();
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
                return this.controller.viewStore.getLayer(this.gameObject);
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
                this.controller.model3dController.set3dModelForCanvasItem(this.gameObject);
                this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
                break;
            case MeshViewPropType.TEXTURE:
                this.gameObject.texturePath = val.path;
                this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
                break;
            case MeshViewPropType.THUMBNAIL:
                this.gameObject.thumbnailPath = val.path;
                this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
                break;
            case MeshViewPropType.LAYER:
                this.controller.viewStore.setLayer(this.gameObject, val);
                this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
                break;
            case MeshViewPropType.ROTATION:
                this.gameObject.rotation = this.convertValue(val, prop, this.gameObject.rotation);
                this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
                break;
            case MeshViewPropType.SCALE:
                this.gameObject.scale = this.convertValue(val, prop, this.gameObject.scale);
                this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
                break;
            case MeshViewPropType.NAME:
                this.gameObject.name = val;
                this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
                break;
            case MeshViewPropType.PATH:
                this.gameObject.path = val;
                this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
                break;
            case MeshViewPropType.IS_MANUAL_CONTROL:
                this.gameObject.isManualControl = val;
                this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
                break;
            case MeshViewPropType.ANIMATION:
                this.gameObject.activeAnimation = val;
                this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
                break;
            case MeshViewPropType.AnimationState:
                this.gameObject.animationState = val;
                this.controller.getGameApi().meshObjectUpdater.updateAnimationState(this.gameObject.animationState, this.gameObject.name)
                break;
        }
    }
}