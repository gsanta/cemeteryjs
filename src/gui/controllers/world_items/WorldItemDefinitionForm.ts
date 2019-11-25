import { IFormController } from '../IFormController';
import { cloneWorldItemType, WorldItemDefinitionModel } from './WorldItemDefinitionModel';
import { IEditableCanvas } from '../canvases/IEditableCanvas';

export enum WorldItemTypeProperty {
    TYPE_NAME = 'typeName',
    CHAR = 'char',
    MODEL = 'model',
    SHAPE = 'shape',
    SCALE = 'scale',
    TRANSLATE_Y = 'translateY',
    MATERIALS = 'materials',
    COLOR = 'color'
}

export class WorldItemDefinitionForm extends IFormController<WorldItemTypeProperty> {
    shapes: string[] = ['rect'];

    private canvasController: IEditableCanvas;

    constructor(canvasController: IEditableCanvas) {
        super();
        this.canvasController = canvasController;
        this.setSelectedDefinition(this.getModel().types[0].typeName);
    }

    private tempString: string;
    private tempBoolean: boolean;
    private tempNumber: number;
    focusedPropType: WorldItemTypeProperty;

    focusProp(type: WorldItemTypeProperty) {
        this.focusedPropType = type;
        switch(this.focusedPropType) {
            case WorldItemTypeProperty.MODEL:
                this.tempString = this.getModel().selectedType.model;
                break;
            case WorldItemTypeProperty.CHAR:
                this.tempString = this.getModel().selectedType.char;
                break;
            case WorldItemTypeProperty.TYPE_NAME:
                this.tempString = this.getModel().selectedType.typeName;
                break;
            case WorldItemTypeProperty.SCALE:
                this.tempNumber = this.getModel().selectedType.scale;
                break;
            case WorldItemTypeProperty.SHAPE:
                this.tempString = this.getModel().selectedType.shape;
                break;
            case WorldItemTypeProperty.TRANSLATE_Y:
                this.tempNumber = this.getModel().selectedType.translateY;
                break;
            case WorldItemTypeProperty.MATERIALS:
                this.tempString = "";
                break;
            case WorldItemTypeProperty.COLOR:
                this.tempString = this.getModel().selectedType.color;
                break;
        }
        this.canvasController.render();
    }

    getFocusedProp(): WorldItemTypeProperty { 
        return this.focusedPropType
    }

    updateStringProp(value: string) {
        this.tempString = value;
        this.canvasController.render();
    }

    updateBooleanProp(value: boolean) {
        this.tempBoolean = value;
        this.canvasController.render();
    }

    updateNumberProp(value: number) {
        this.tempNumber = value;
        this.canvasController.render();
    }

    deletItemFromListProp(prop: WorldItemTypeProperty, index: number) {
        switch(prop) {
            case WorldItemTypeProperty.MATERIALS:
                this.getModel().selectedType.materials.splice(index, 1);
                this.getModel().syncSelected(this.getModel().selectedType.typeName);
                break;
        } 

        this.canvasController.render();
    }

    commitProp(removeFocus = false) {
        const worldItemType = this.getModel().types.find(desc => desc.typeName === this.getModel().selectedType.typeName);

        switch(this.focusedPropType) {
            case WorldItemTypeProperty.MODEL:
                this.getModel().selectedType.model = this.tempString;
                break;
            case WorldItemTypeProperty.CHAR:
                this.getModel().selectedType.char = this.tempString;
                break;
            case WorldItemTypeProperty.SCALE:
                this.getModel().selectedType.scale = this.tempNumber;
                break;
            case WorldItemTypeProperty.SHAPE:
                this.getModel().selectedType.shape = this.tempString;
                break;
            case WorldItemTypeProperty.TRANSLATE_Y:
                this.getModel().selectedType.translateY = this.tempNumber;
                break;
            case WorldItemTypeProperty.TYPE_NAME:
                this.getModel().selectedType.typeName = this.tempString;
                break;
            case WorldItemTypeProperty.MATERIALS:
                this.getModel().selectedType.materials.push(this.tempString);
                this.tempString = '';
                this.focusedPropType = null;
                break;
            case WorldItemTypeProperty.COLOR:
                this.getModel().selectedType.color = this.tempString;
                this.tempString = '';
                break;
        }

        this.getModel().syncSelected(worldItemType.typeName);

        if (removeFocus) {
            this.focusedPropType = null;
        }

        this.canvasController.render();
    }

    getVal(property: WorldItemTypeProperty) {
        switch(property) {
            case WorldItemTypeProperty.MODEL:
                return this.focusedPropType === property ? this.tempString : this.getModel().selectedType.model;
            case WorldItemTypeProperty.CHAR:
                return this.focusedPropType === property ? this.tempString : this.getModel().selectedType.char;
            case WorldItemTypeProperty.SCALE:
                return this.focusedPropType === property ? this.tempNumber : this.getModel().selectedType.scale;
            case WorldItemTypeProperty.SHAPE:
                return this.focusedPropType === property ? this.tempString : this.getModel().selectedType.shape;
            case WorldItemTypeProperty.TRANSLATE_Y:
                return this.focusedPropType === property ? this.tempNumber : this.getModel().selectedType.translateY;
            case WorldItemTypeProperty.TYPE_NAME:
                return this.focusedPropType === property ? this.tempString : this.getModel().selectedType.typeName;
            case WorldItemTypeProperty.MATERIALS:
                return this.focusedPropType === property ? this.tempString : '';
            case WorldItemTypeProperty.COLOR:
                return this.focusedPropType === property ? this.tempString : this.getModel().selectedType.color;
        }
    }

    setSelectedDefinition(type: string) {
        if (this.getModel().selectedType) {
            this.getModel().syncSelected(this.getModel().selectedType.typeName);
        }

        const meshDescriptor = this.getModel().types.find(descriptor => descriptor.typeName === type);
        this.getModel().selectedType = cloneWorldItemType(meshDescriptor);

        this.canvasController.render();
    }

    getModel(): WorldItemDefinitionModel {
        return this.canvasController.worldItemDefinitionModel;
    }
}
