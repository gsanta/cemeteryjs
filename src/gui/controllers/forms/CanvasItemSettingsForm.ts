import { AbstractFormController } from "./AbstractFormController";
import { CanvasItem } from '../canvases/svg/models/PixelModel';
import { ControllerFacade } from "../ControllerFacade";
import { IEditableCanvas } from '../canvases/IEditableCanvas';


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
    }

    updateStringProp(value: string) {
        this.tempString = value;        
        this.renderFunc();       
    }

    commitProp() {
        this.canvasController.renderCanvas();
        this.renderFunc();
    }
}