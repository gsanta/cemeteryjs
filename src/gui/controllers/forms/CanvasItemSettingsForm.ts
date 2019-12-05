import { AbstractFormController } from "./AbstractFormController";
import { CanvasItem } from '../canvases/svg/models/PixelModel';
import { ControllerFacade } from "../ControllerFacade";
import { IEditableCanvas } from '../canvases/IEditableCanvas';
import { SettingsForm } from './SettingsForm';


export enum CanvasItemSettings {
    COLOR = 'color',
}

export class CanvasItemSettingsForm extends AbstractFormController<CanvasItemSettings> {
    canvasItem: CanvasItem;

    private canvasController: IEditableCanvas;

    constructor(canvasController: IEditableCanvas) {
        super();
        this.canvasController = canvasController;
    }

    focusProp(propType: CanvasItemSettings) {
        this.focusedPropType = propType;
        switch(this.focusedPropType) {
            case CanvasItemSettings.COLOR:
                this.tempString = this.canvasItem.color;
                break;
        }

        this.renderFunc();
    }

    updateStringProp(value: string) {
        this.tempString = value;        
        this.renderFunc();       
    }

    commitProp() {
        this.canvasController.renderCanvas();

        switch(this.focusedPropType) {
            case CanvasItemSettings.COLOR:
                this.canvasItem.color = this.tempString;
                break;
        }

        this.focusedPropType = null;
        this.renderFunc();
    }


    getVal(property: CanvasItemSettings) {
        switch(property) {
            case CanvasItemSettings.COLOR:
                return this.focusedPropType === property ? this.tempString : this.canvasItem.color;
        }
    }
}