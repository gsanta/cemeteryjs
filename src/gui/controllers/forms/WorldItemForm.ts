import { IFormController } from "./IFormController";
import { ControllerFacade } from "../ControllerFacade";
import { IEditableCanvas } from "../canvases/IEditableCanvas";
import { SvgCanvasController } from "../canvases/svg/SvgCanvasController";
import { SettingsProperty } from "./SettingsForm";


export enum WorldItemFormProperty {
    COLOR = 'color'
}

export class WorldItemForm extends IFormController<WorldItemFormProperty> {
    focusedPropType: WorldItemFormProperty;

    private tempString: string;
    private controllers: ControllerFacade;

    private renderFunc = () => null;

    constructor(controllers: ControllerFacade) {
        super();
        this.controllers = controllers;
        this.controllers.settingsModel.activeEditor = <IEditableCanvas> this.controllers.getCanvasControllerById(SvgCanvasController.id);
    }

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }

    setActiveDialog(dialogName: string) {
        this.controllers.settingsModel.activeDialog = dialogName;
        this.controllers.updateUIController.updateUI();       
    }

    focusProp(propType: WorldItemFormProperty) {
        this.focusedPropType = propType;
        switch(this.focusedPropType) {
            case WorldItemFormProperty.COLOR:
                this.tempString = this.controllers.settingsModel.activeEditor.getId();
                break;
        }
    }

    updateStringProp(value: string) {
        this.tempString = value;        
        this.renderFunc();       
    }

    commitProp() {
        switch(this.focusedPropType) {
            case WorldItemFormProperty.COLOR:
                this.controllers.settingsModel.activeEditor = this.findEditorById(this.tempString);
                this.controllers.settingsModel.activeEditor.activate();
                break;
        }

        this.controllers.webglCanvasController.isDirty = true;
        this.renderFunc();
    }

    getVal(propType: SettingsProperty) {
        switch(propType) {
            case SettingsProperty.EDITOR:
                return this.focusedPropType === propType ? this.tempString : this.controllers.settingsModel.activeEditor.getId();
            case SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN:
                return this.focusedPropType === propType ? this.tempBoolean : this.controllers.settingsModel.isWorldItemTypeEditorOpen;

        }
    }

    private findEditorById(id: string): IEditableCanvas {
        return this.controllers.editors.find(editor => editor.getId() === id);
    }
}