import { MeshView } from '../../../common/views/MeshView';
import { CanvasController } from '../canvases/svg/CanvasController';
import { EventDispatcher } from '../events/EventDispatcher';
import { Events } from '../events/Events';
import { AbstractForm } from "./AbstractForm";
import { EditorFacade } from '../EditorFacade';

export enum GameObjectPropType {
    COLOR = 'color',
    MODEL = 'model',
    TEXTURE = 'texture',
    THUMBNAIL = 'thumbnail',
    LAYER = 'layer',
    ROTATION = 'rotation',
    SCALE = 'scale',
    NAME = 'name',
    PATH = 'path'
}

export class GameObjectForm extends AbstractForm<GameObjectPropType> {
    gameObject: MeshView;

    private services: EditorFacade;
    private eventDispatcher: EventDispatcher;

    constructor(services: EditorFacade, eventDispatcher: EventDispatcher) {
        super();
        this.services = services;
        this.eventDispatcher = eventDispatcher;
    }

    blurProp() {
        super.blurProp();

        this.services.svgCanvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
    }

    updateProp(value: any, propType: GameObjectPropType) {
        super.updateProp(value, propType);

        this.services.svgCanvasController.renderCanvas();
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
                return this.services.viewStore.getLayer(this.gameObject);
            case GameObjectPropType.ROTATION:
                return this.gameObject.rotation;
            case GameObjectPropType.SCALE:
                return this.gameObject.scale;
            case GameObjectPropType.NAME:
                return this.gameObject.name;
            case GameObjectPropType.PATH:
                return this.gameObject.path;
        }
    }

    protected setProp(val: any, prop: GameObjectPropType) {
        switch (prop) {
            case GameObjectPropType.COLOR:
                this.gameObject.color = val;
                break;
            case GameObjectPropType.MODEL:
                this.gameObject.modelPath = val.path;
                this.services.svgCanvasController.model3dController.set3dModelForCanvasItem(this.gameObject);
                break;
            case GameObjectPropType.TEXTURE:
                this.gameObject.texturePath = val.path;
                break;
            case GameObjectPropType.THUMBNAIL:
                this.gameObject.thumbnailPath = val.data;
                break;
            case GameObjectPropType.LAYER:
                this.services.viewStore.setLayer(this.gameObject, val);
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
        }
    }
}