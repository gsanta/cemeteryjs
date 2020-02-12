import { MeshView } from '../../../common/views/MeshView';
import { CanvasController } from '../canvases/svg/CanvasController';
import { EventDispatcher } from '../events/EventDispatcher';
import { Events } from '../events/Events';
import { AbstractForm } from "./AbstractForm";

export enum GameObjectPropType {
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
    ANIMATION = 'animation'
}

export class GameObjectForm extends AbstractForm<GameObjectPropType> {
    gameObject: MeshView;

    private controller: CanvasController;
    private eventDispatcher: EventDispatcher;

    constructor(controller: CanvasController, eventDispatcher: EventDispatcher) {
        super();
        this.controller = controller;
        this.eventDispatcher = eventDispatcher;
    }

    blurProp() {
        super.blurProp();

        this.controller.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
    }

    updateProp(value: any, propType: GameObjectPropType) {
        super.updateProp(value, propType);

        this.controller.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
    }

    protected getProp(prop: GameObjectPropType) {
        switch (prop) {
            case GameObjectPropType.COLOR:
                return this.gameObject.color;
            case GameObjectPropType.MODEL:
                return this.gameObject.modelPath;
            case GameObjectPropType.TEXTURE:
                return this.gameObject.texturePath;
            case GameObjectPropType.THUMBNAIL:
                return this.gameObject.thumbnailPath;
            case GameObjectPropType.LAYER:
                return this.controller.viewStore.getLayer(this.gameObject);
            case GameObjectPropType.ROTATION:
                return this.gameObject.rotation;
            case GameObjectPropType.SCALE:
                return this.gameObject.scale;
            case GameObjectPropType.NAME:
                return this.gameObject.name;
            case GameObjectPropType.PATH:
                return this.gameObject.path;
            case GameObjectPropType.IS_MANUAL_CONTROL:
                return this.gameObject.isManualControl;
            case GameObjectPropType.ANIMATION:
                return this.gameObject.activeAnimation;
        }
    }

    protected setProp(val: any, prop: GameObjectPropType) {
        switch (prop) {
            case GameObjectPropType.COLOR:
                this.gameObject.color = val;
                break;
            case GameObjectPropType.MODEL:
                this.gameObject.modelPath = val.path;
                this.controller.model3dController.set3dModelForCanvasItem(this.gameObject);
                break;
            case GameObjectPropType.TEXTURE:
                this.gameObject.texturePath = val.path;
                break;
            case GameObjectPropType.THUMBNAIL:
                this.gameObject.thumbnailPath = val.data;
                break;
            case GameObjectPropType.LAYER:
                this.controller.viewStore.setLayer(this.gameObject, val);
                break;
            case GameObjectPropType.ROTATION:
                this.gameObject.rotation = val;
                break;
            case GameObjectPropType.SCALE:
                this.gameObject.scale = val;
                break;
            case GameObjectPropType.NAME:
                this.gameObject.name = val;
                break;
            case GameObjectPropType.PATH:
                this.gameObject.path = val;
                break;
            case GameObjectPropType.IS_MANUAL_CONTROL:
                this.gameObject.isManualControl = val;
                break;
            case GameObjectPropType.ANIMATION:
                this.gameObject.activeAnimation = val;
                break;
        }
    }
}