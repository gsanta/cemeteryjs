import { IFormController } from '../IFormController';
import { ControllerFacade } from '../ControllerFacade';
import { IEditableCanvas } from '../canvases/IEditableCanvas';
import { SvgCanvasController } from '../canvases/svg/SvgCanvasController';

export enum SettingsProperty {
    EDITOR = 'editor',
    IS_WORLD_ITEM_TYPE_EDITOR_OPEN = 'is-properties-window-open'
}

export class SettingsController extends IFormController<SettingsProperty> {
    focusedPropType: SettingsProperty;

    private tempString: string;
    private tempBoolean: boolean;
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

    focusProp(propType: SettingsProperty) {
        this.focusedPropType = propType;
        switch(this.focusedPropType) {
            case SettingsProperty.EDITOR:
                this.tempString = this.controllers.settingsModel.activeEditor.getId();
                break;
            case SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN:
                this.tempBoolean = this.controllers.settingsModel.isWorldItemTypeEditorOpen;
                break;
        }
    }

    updateStringProp(value: string) {
        this.tempString = value;        
        this.renderFunc();       
    }

    updateBooleanProp(value: boolean) {
        this.tempBoolean = value;        
        
        this.renderFunc();
    }


    commitProp() {
        switch(this.focusedPropType) {
            case SettingsProperty.EDITOR:
                this.controllers.settingsModel.activeEditor = this.findEditorById(this.tempString);
                this.controllers.settingsModel.activeEditor.activate();
                break;
            case SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN:
                this.controllers.settingsModel.isWorldItemTypeEditorOpen = this.tempBoolean;
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