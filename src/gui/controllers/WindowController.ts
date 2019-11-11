import { FormController } from './FormController';
import { ControllerFacade } from './ControllerFacade';
import { EditorType, WindowModel } from '../models/WindowModel';

export enum WindowProperty {
    EDITOR = 'editor',
    IS_WORLD_ITEM_TYPE_EDITOR_OPEN = 'is-properties-window-open'
}

export class WindowController extends FormController<WindowProperty> {
    focusedPropType: WindowProperty;

    private tempString: string;
    private tempBoolean: boolean;
    private controllers: ControllerFacade;

    constructor(controllers: ControllerFacade) {
        super();
        this.controllers = controllers;
    }

    focusProp(propType: WindowProperty) {
        this.focusedPropType = propType;
        switch(this.focusedPropType) {
            case WindowProperty.EDITOR:
                this.tempString = this.controllers.windowModel.activeEditor;
                break;
            case WindowProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN:
                this.tempBoolean = this.controllers.windowModel.isWorldItemTypeEditorOpen;
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
            case WindowProperty.EDITOR:
                this.controllers.windowModel.activeEditor = <EditorType> this.tempString;
                break;
            case WindowProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN:
                this.controllers.windowModel.isWorldItemTypeEditorOpen = this.tempBoolean;
                break;    
        }

        this.controllers.updateUIController.updateUI();
    }

    getVal(propType: WindowProperty) {
        switch(propType) {
            case WindowProperty.EDITOR:
                return this.focusedPropType === propType ? this.tempString : this.controllers.windowModel.activeEditor;
            case WindowProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN:
                return this.focusedPropType === propType ? this.tempBoolean : this.controllers.windowModel.isWorldItemTypeEditorOpen;

        }
    }
}