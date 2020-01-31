import { GameObject } from '../../../world_generator/services/GameObject';
import { SvgCanvasController } from '../canvases/svg/SvgCanvasController';
import { EventDispatcher } from '../events/EventDispatcher';
import { Events } from '../events/Events';
import { AbstractFormController } from "./AbstractFormController";

export enum GameObjectPropType {
    COLOR = 'color',
    SHAPE = 'shape',
    MODEL = 'model',
    TEXTURE = 'texture',
    THUMBNAIL = 'thumbnail',
    LAYER = 'layer',
    ROTATION = 'rotation',
    SCALE = 'scale',
    NAME = 'name'
}

export class GameObjectForm extends AbstractFormController<GameObjectPropType> {
    shapes: string[] = ['rect', 'model'];
    gameObject: GameObject;

    private canvasController: SvgCanvasController;
    private eventDispatcher: EventDispatcher;

    constructor(canvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        super();
        this.canvasController = canvasController;
        this.eventDispatcher = eventDispatcher;
    }

    commitProp() {
        super.commitProp();

        this.canvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
    }

    protected getProp(prop: GameObjectPropType) {
        switch (prop) {
            case GameObjectPropType.COLOR:
                return this.gameObject.color;
            case GameObjectPropType.SHAPE:
                return this.gameObject.shape;
            case GameObjectPropType.MODEL:
                return this.gameObject.modelPath;
            case GameObjectPropType.TEXTURE:
                return this.gameObject.texturePath;
            case GameObjectPropType.THUMBNAIL:
                return this.gameObject.texturePath;
            case GameObjectPropType.LAYER:
                return this.canvasController.canvasStore.getLayer(this.gameObject) + '';
            case GameObjectPropType.ROTATION:
                return this.gameObject.rotation;
            case GameObjectPropType.SCALE:
                return this.gameObject.scale;
            case GameObjectPropType.NAME:
                return this.gameObject.name;
        }
    }

    protected setProp(val: any, prop: GameObjectPropType) {
        switch (prop) {
            case GameObjectPropType.COLOR:
                this.gameObject.color = val;
                break;
            case GameObjectPropType.SHAPE:
                this.gameObject.shape = val;
                break;
            case GameObjectPropType.MODEL:
                this.gameObject.modelPath = val;
                this.canvasController.model3dController.set3dModelForCanvasItem(this.gameObject);
                break;
            case GameObjectPropType.TEXTURE:
                this.gameObject.texturePath = val;
                break;
            case GameObjectPropType.THUMBNAIL:
                this.gameObject.texturePath = val;
                break;
            case GameObjectPropType.LAYER:
                this.canvasController.canvasStore.setLayer(this.gameObject, val);
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
        }
    }
}