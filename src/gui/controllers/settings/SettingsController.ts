import { IFormController } from '../IFormController';
import { ControllerFacade } from '../ControllerFacade';
import { IReadableWriteableEditor } from '../editors/IReadableWriteableEditor';
import { Events } from '../events/Events';

export enum SettingsProperty {
    EDITOR = 'editor',
    IS_WORLD_ITEM_TYPE_EDITOR_OPEN = 'is-properties-window-open'
}

export class SettingsController extends IFormController<SettingsProperty> {
    focusedPropType: SettingsProperty;

    private tempString: string;
    private tempBoolean: boolean;
    private controllers: ControllerFacade;

    constructor(controllers: ControllerFacade) {
        super();
        this.controllers = controllers;
        this.controllers.settingsModel.activeEditor = this.controllers.bitmapEditorController;
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
        this.controllers.updateUIController.updateUI();       
    }

    updateBooleanProp(value: boolean) {
        this.tempBoolean = value;        
        this.controllers.updateUIController.updateUI();       
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

        this.controllers.webglEditorController.isDirty = true;
        this.controllers.updateUIController.updateUI();
    }

    getVal(propType: SettingsProperty) {
        switch(propType) {
            case SettingsProperty.EDITOR:
                return this.focusedPropType === propType ? this.tempString : this.controllers.settingsModel.activeEditor.getId();
            case SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN:
                return this.focusedPropType === propType ? this.tempBoolean : this.controllers.settingsModel.isWorldItemTypeEditorOpen;

        }
    }

    private findEditorById(id: string): IReadableWriteableEditor {
        return this.controllers.editors.find(editor => editor.getId() === id);
    }
}