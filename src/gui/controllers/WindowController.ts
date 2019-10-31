import { FormController } from './FormController';
import { ControllerFacade } from './ControllerFacade';

export enum EditorType {
    TEXT_EDITOR = 'text-editor',
    DRAW_EDITOR = 'draw-editor'
}

export enum WindowProperty {
    EDITOR = 'editor'
}

export class WindowController extends FormController<WindowProperty> {
    focusedPropType: WindowProperty;
    private tempString: string;
    activeEditor: EditorType = EditorType.DRAW_EDITOR;
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
        }
    }

    updateStringProp(value: string) {
        this.tempString = value;        
        this.controllers.renderController.render();       
    }

    commitProp() {
        switch(this.focusedPropType) {
            case WindowProperty.EDITOR:
                this.activeEditor = <EditorType> this.tempString;
                break;
        }

        this.controllers.renderController.render();
    }

    getVal(propType: WindowProperty) {
        switch(propType) {
            case WindowProperty.EDITOR:
                return this.focusedPropType === propType ? this.tempString : this.activeEditor;
        }
    }
}