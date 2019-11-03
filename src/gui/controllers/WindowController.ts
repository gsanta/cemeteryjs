import { FormController } from './FormController';
import { ControllerFacade } from './ControllerFacade';

export enum EditorType {
    TEXT_EDITOR = 'text-editor',
    BITMAP_EDITOR = 'draw-editor'
}

export enum WindowProperty {
    EDITOR = 'editor',
    IS_PROPERTIES_WINDOW_OPEN = 'is-properties-window-open'
}

export class WindowController extends FormController<WindowProperty> {
    focusedPropType: WindowProperty;
    activeEditor: EditorType = EditorType.BITMAP_EDITOR;
    isPropertiesWindowOpen = true;

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
                this.tempString = this.activeEditor;
                break;
            case WindowProperty.IS_PROPERTIES_WINDOW_OPEN:
                this.tempBoolean = this.isPropertiesWindowOpen;
                break;
        }
    }

    updateStringProp(value: string) {
        this.tempString = value;        
        this.controllers.renderController.render();       
    }

    updateBooleanProp(value: boolean) {
        this.tempBoolean = value;        
        this.controllers.renderController.render();       
    }


    commitProp() {
        switch(this.focusedPropType) {
            case WindowProperty.EDITOR:
                this.activeEditor = <EditorType> this.tempString;
                break;
            case WindowProperty.IS_PROPERTIES_WINDOW_OPEN:
                this.isPropertiesWindowOpen = this.tempBoolean;
                break;    
        }

        this.controllers.renderController.render();
    }

    getVal(propType: WindowProperty) {
        switch(propType) {
            case WindowProperty.EDITOR:
                return this.focusedPropType === propType ? this.tempString : this.activeEditor;
            case WindowProperty.IS_PROPERTIES_WINDOW_OPEN:
                return this.focusedPropType === propType ? this.tempBoolean : this.isPropertiesWindowOpen;

        }
    }
}