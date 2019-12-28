import { AbstractFormController } from "./AbstractFormController";
import { EventDispatcher } from '../events/EventDispatcher';
import { Events } from '../events/Events';
import { WorldItemShape } from '../../../world_generator/services/GameObject';
import { CanvasItem } from '../canvases/svg/models/SvgCanvasStore';
import { SvgCanvasController } from '../canvases/svg/SvgCanvasController';


export enum CanvasItemSettings {
    COLOR = 'color',
    SHAPE = 'shape',
    MODEL = 'model',
    LAYER = 'layer',
    ROTATION = 'rotation'
}

export class CanvasItemSettingsForm extends AbstractFormController<CanvasItemSettings> {
    shapes: string[] = ['rect', 'model'];
    canvasItem: CanvasItem;

    private canvasController: SvgCanvasController;
    private eventDispatcher: EventDispatcher;

    constructor(canvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        super();
        this.canvasController = canvasController;
        this.eventDispatcher = eventDispatcher;
    }

    focusProp(propType: CanvasItemSettings) {
        this.focusedPropType = propType;
        switch (this.focusedPropType) {
            case CanvasItemSettings.COLOR:
                this.tempString = this.canvasItem.color;
                break;
            case CanvasItemSettings.SHAPE:
                this.tempString = this.canvasItem.shape;
                break;
            case CanvasItemSettings.MODEL:
                this.tempString = this.canvasItem.model;
                break;
            case CanvasItemSettings.LAYER:
                this.tempString = this.canvasItem.layer + '';
                break;
            case CanvasItemSettings.ROTATION:
                this.tempNumber = this.canvasItem.rotation;
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
                this.canvasItem.model = this.tempString;
                this.canvasController.model3dController.set3dModelForCanvasItem(this.canvasItem);
                this.tempString = null;
                break;
            case CanvasItemSettings.LAYER:
                this.canvasItem.layer = parseInt(this.tempString, 10);
                this.tempString = null;
                break;
            case CanvasItemSettings.ROTATION:
                this.canvasItem.rotation = this.tempNumber;
                this.tempNumber = null;
                break;
        }

        this.focusedPropType = null;
        this.renderFunc();
        this.eventDispatcher.dispatchEvent(Events.CANVAS_ITEM_CHANGED);
    }


    getVal<T>(property: CanvasItemSettings): T {
        let ret: any;
        switch (property) {
            case CanvasItemSettings.COLOR:
                ret = this.focusedPropType === property ? this.tempString : this.canvasItem.color;
                break;
            case CanvasItemSettings.SHAPE:
                ret = this.focusedPropType === property ? this.tempString : this.canvasItem.shape;
                break;
            case CanvasItemSettings.MODEL:
                ret = this.focusedPropType === property ? this.tempString : this.canvasItem.model;
                break;
            case CanvasItemSettings.LAYER:
                ret = this.focusedPropType === property ? this.tempString : this.canvasItem.layer;
                break;
            case CanvasItemSettings.ROTATION:
                ret = this.focusedPropType === property ? this.tempNumber : this.canvasItem.rotation;
                break;
        }

        return <T> ret;
    }
}