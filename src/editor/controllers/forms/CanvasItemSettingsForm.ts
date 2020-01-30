import { AbstractFormController } from "./AbstractFormController";
import { EventDispatcher } from '../events/EventDispatcher';
import { Events } from '../events/Events';
import { WorldItemShape } from '../../../world_generator/services/GameObject';
import { SvgCanvasController } from '../canvases/svg/SvgCanvasController';
import { CanvasRect } from "../canvases/svg/models/CanvasItem";


export enum CanvasItemSettings {
    COLOR = 'color',
    SHAPE = 'shape',
    MODEL = 'model',
    TEXTURE = 'texture',
    LAYER = 'layer',
    ROTATION = 'rotation',
    SCALE = 'scale',
    NAME = 'name'
}

export class CanvasItemSettingsForm extends AbstractFormController<CanvasItemSettings> {
    shapes: string[] = ['rect', 'model'];
    canvasItem: CanvasRect;

    private canvasController: SvgCanvasController;
    private eventDispatcher: EventDispatcher;

    constructor(canvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        super();
        this.canvasController = canvasController;
        this.eventDispatcher = eventDispatcher;
    }

    focusProp(propType: CanvasItemSettings) {
        const canvasStore = this.canvasController.canvasStore;
        this.focusedPropType = propType;
        switch (this.focusedPropType) {
            case CanvasItemSettings.COLOR:
                this.tempString = this.canvasItem.color;
                break;
            case CanvasItemSettings.SHAPE:
                this.tempString = this.canvasItem.shape;
                break;
            case CanvasItemSettings.MODEL:
                this.tempString = this.canvasItem.modelPath;
                break;
            case CanvasItemSettings.TEXTURE:
                this.tempString = this.canvasItem.texturePath;
                break;
            case CanvasItemSettings.LAYER:
                this.tempString = canvasStore.getLayer(this.canvasItem) + '';
                break;
            case CanvasItemSettings.ROTATION:
                this.tempNumber = this.canvasItem.rotation;
                break;
            case CanvasItemSettings.SCALE:
                this.tempNumber = this.canvasItem.scale;
                break;
            case CanvasItemSettings.NAME:
                this.tempString = this.canvasItem.name;
                break;
        }

        this.renderFunc();
    }

    updateStringProp(value: string) {
        this.tempString = value;
        this.renderFunc();
    }

    updateNumberProp(value: string) {
        this.tempNumber = parseInt(value, 10);
        this.renderFunc();
    }

    commitProp() {
        this.canvasController.renderCanvas();
        const canvasStore = this.canvasController.canvasStore;

        switch (this.focusedPropType) {
            case CanvasItemSettings.COLOR:
                this.canvasItem.color = this.tempString;
                this.tempString = null;
                break;
            case CanvasItemSettings.SHAPE:
                this.canvasItem.shape = <WorldItemShape>this.tempString;
                this.tempString = null;
                break;
            case CanvasItemSettings.MODEL:
                this.canvasItem.modelPath = this.tempString;
                this.canvasController.model3dController.set3dModelForCanvasItem(this.canvasItem);
                this.tempString = null;
                break;
            case CanvasItemSettings.TEXTURE:
                this.canvasItem.texturePath = this.tempString;
                this.tempString = null;
                break;    
            case CanvasItemSettings.LAYER:
                canvasStore.setLayer(this.canvasItem, parseInt(this.tempString, 10));
                this.tempString = null;
                break;
            case CanvasItemSettings.ROTATION:
                this.canvasItem.rotation = this.tempNumber;
                this.tempNumber = null;
                break;
            case CanvasItemSettings.SCALE:
                this.canvasItem.scale = this.tempNumber;
                this.tempNumber = null;
                break;
            case CanvasItemSettings.NAME:
                this.canvasItem.name = this.tempString;
                break;
        }

        this.focusedPropType = null;
        this.renderFunc();
        this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
    }


    getVal<T>(property: CanvasItemSettings): T {
        const canvasStore = this.canvasController.canvasStore;

        let ret: any;
        switch (property) {
            case CanvasItemSettings.COLOR:
                ret = this.focusedPropType === property ? this.tempString : this.canvasItem.color;
                break;
            case CanvasItemSettings.SHAPE:
                ret = this.focusedPropType === property ? this.tempString : this.canvasItem.shape;
                break;
            case CanvasItemSettings.MODEL:
                ret = this.focusedPropType === property ? this.tempString : this.canvasItem.modelPath;
                break;
            case CanvasItemSettings.TEXTURE:
                ret = this.focusedPropType === property ? this.tempString : this.canvasItem.texturePath;
                break;
            case CanvasItemSettings.LAYER:
                ret = this.focusedPropType === property ? this.tempString : canvasStore.getLayer(this.canvasItem);
                break;
            case CanvasItemSettings.ROTATION:
                ret = this.focusedPropType === property ? this.tempNumber : this.canvasItem.rotation;
                break;
            case CanvasItemSettings.SCALE:
                ret = this.focusedPropType === property ? this.tempNumber : this.canvasItem.scale;
                break;
            case CanvasItemSettings.NAME:
                ret = this.focusedPropType === property ? this.tempString : this.canvasItem.name;
                break;
        }

        return <T> ret;
    }
}