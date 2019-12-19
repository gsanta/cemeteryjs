import { IEditableCanvas } from '../canvases/IEditableCanvas';
import { CanvasItem, FileData } from '../canvases/svg/models/GridCanvasStore';
import { AbstractFormController } from "./AbstractFormController";
import { EventDispatcher } from '../events/EventDispatcher';
import { Events } from '../events/Events';
import { WorldItemShape } from '../../../model/types/GameObject';


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

    private canvasController: IEditableCanvas;
    private eventDispatcher: EventDispatcher;

    constructor(canvasController: IEditableCanvas, eventDispatcher: EventDispatcher) {
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
                this.tempFileData = this.canvasItem.model;
                break;
            case CanvasItemSettings.LAYER:
                this.tempNumber = this.canvasItem.layer;
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

    updateFileDataProp(fileData: FileData) {
        this.tempFileData = fileData;
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
                this.canvasItem.model = this.tempFileData.fileName;
                this.tempFileData = { FileData: '', data: '' };
                break;
            case CanvasItemSettings.LAYER:
                this.canvasItem.layer = this.tempNumber;
                this.tempNumber = null;
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
                ret = this.focusedPropType === property ? this.tempFileData : this.canvasItem.model;
                break;
            case CanvasItemSettings.LAYER:
                ret = this.focusedPropType === property ? this.tempNumber : this.canvasItem.layer;
                break;
            case CanvasItemSettings.ROTATION:
                ret = this.focusedPropType === property ? this.tempNumber : this.canvasItem.rotation;
                break;
        }

        return <T> ret;
    }
}