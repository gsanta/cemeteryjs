import { WorldItemType } from "../../WorldItemType";
import { ControllerFacade } from "./ControllerFacade";
import { FormController } from './FormController';

export enum DefinitionProperty {
    TYPE = 'type',
    CHAR = 'char',
    MODEL = 'model',
    SHAPE = 'shape',
    SCALE = 'scale',
    TRANSLATE_Y = 'translateY',
    MATERIALS = 'materials',
    IS_BORDER = 'isBorder',
    COLOR = 'color'
}

function cloneMeshDescriptor(descriptor: WorldItemType) {
    const clone = {...descriptor};

    if (clone.materials) {
        clone.materials = [...clone.materials];
    }

    return clone;
}

export class DefinitionController extends FormController<DefinitionProperty> {
    shapes: string[] = ['rect'];

    worldItemTypes: WorldItemType[];
    selectedWorldItemType: WorldItemType;

    private controllers: ControllerFacade;

    constructor(controllers: ControllerFacade, worldItemTypes: WorldItemType[]) {
        super();
        this.controllers = controllers;
        this.worldItemTypes = worldItemTypes;
        this.setSelectedDefinition(this.worldItemTypes[0].type);
    }

    private tempString: string;
    private tempBoolean: boolean;
    private tempNumber: number;
    focusedPropType: DefinitionProperty;

    focusProp(type: DefinitionProperty) {
        this.focusedPropType = type;
        switch(this.focusedPropType) {
            case DefinitionProperty.MODEL:
                this.tempString = this.selectedWorldItemType.model;
                break;
            case DefinitionProperty.CHAR:
                this.tempString = this.selectedWorldItemType.char;
                break;
            case DefinitionProperty.TYPE:
                this.tempString = this.selectedWorldItemType.type;
                break;
            case DefinitionProperty.IS_BORDER:
                this.tempBoolean = this.selectedWorldItemType.isBorder;
                break;
            case DefinitionProperty.SCALE:
                this.tempNumber = this.selectedWorldItemType.scale;
                break;
            case DefinitionProperty.SHAPE:
                this.tempString = this.selectedWorldItemType.shape;
                break;
            case DefinitionProperty.TRANSLATE_Y:
                this.tempNumber = this.selectedWorldItemType.translateY;
                break;
            case DefinitionProperty.MATERIALS:
                this.tempString = "";
                break;
            case DefinitionProperty.COLOR:
                this.tempString = this.selectedWorldItemType.color;
                break;
        }
        this.controllers.renderController.render();
    }

    getFocusedProp(): DefinitionProperty { 
        return this.focusedPropType
    }

    updateStringProp(value: string) {
        this.tempString = value;        
        this.controllers.renderController.render();            
    }

    updateBooleanProp(value: boolean) {
        this.tempBoolean = value;
        this.controllers.renderController.render();            
    }

    updateNumberProp(value: number) {
        this.tempNumber = value;
        this.controllers.renderController.render();            
    }

    deletItemFromListProp(prop: DefinitionProperty, index: number) {
        switch(prop) {
            case DefinitionProperty.MATERIALS:
                this.selectedWorldItemType.materials.splice(index, 1);
                this.syncSelectedToList(this.worldItemTypes.find(desc => desc.type === this.selectedWorldItemType.type));
                break;
        } 

        this.controllers.renderController.render();
    }

    commitProp(removeFocus = false) {
        const origMeshDescriptor = this.worldItemTypes.find(desc => desc.type === this.selectedWorldItemType.type);

        switch(this.focusedPropType) {
            case DefinitionProperty.MODEL:
                this.selectedWorldItemType.model = this.tempString;
                break;
            case DefinitionProperty.CHAR:
                this.selectedWorldItemType.char = this.tempString;
                break;
            case DefinitionProperty.IS_BORDER:
                this.selectedWorldItemType.isBorder = this.tempBoolean;
                break;
            case DefinitionProperty.SCALE:
                this.selectedWorldItemType.scale = this.tempNumber;
                break;
            case DefinitionProperty.SHAPE:
                this.selectedWorldItemType.shape = this.tempString;
                break;
            case DefinitionProperty.TRANSLATE_Y:
                this.selectedWorldItemType.translateY = this.tempNumber;
                break;
            case DefinitionProperty.TYPE:
                this.selectedWorldItemType.type = this.tempString;
                break;
            case DefinitionProperty.MATERIALS:
                this.selectedWorldItemType.materials.push(this.tempString);
                this.tempString = '';
                this.focusedPropType = null;
                break;
            case DefinitionProperty.COLOR:
                this.selectedWorldItemType.color = this.tempString;
                this.tempString = '';
                break;
        }

        this.syncSelectedToList(origMeshDescriptor);

        if (removeFocus) {
            this.focusedPropType = null;
        }

        this.controllers.renderController.render();            
    }

    getVal(property: DefinitionProperty) {
        switch(property) {
            case DefinitionProperty.MODEL:
                return this.focusedPropType === property ? this.tempString : this.selectedWorldItemType.model;
            case DefinitionProperty.CHAR:
                return this.focusedPropType === property ? this.tempString : this.selectedWorldItemType.char;
            case DefinitionProperty.IS_BORDER:
                return this.focusedPropType === property ? this.tempBoolean : this.selectedWorldItemType.isBorder;
            case DefinitionProperty.SCALE:
                return this.focusedPropType === property ? this.tempNumber : this.selectedWorldItemType.scale;
            case DefinitionProperty.SHAPE:
                return this.focusedPropType === property ? this.tempString : this.selectedWorldItemType.shape;
            case DefinitionProperty.TRANSLATE_Y:
                return this.focusedPropType === property ? this.tempNumber : this.selectedWorldItemType.translateY;
            case DefinitionProperty.TYPE:
                return this.focusedPropType === property ? this.tempString : this.selectedWorldItemType.type;
            case DefinitionProperty.MATERIALS:
                return this.focusedPropType === property ? this.tempString : '';
            case DefinitionProperty.COLOR:
                return this.focusedPropType === property ? this.tempString : this.selectedWorldItemType.color;
        }
    }

    setSelectedDefinition(type: string) {
        if (this.selectedWorldItemType) {
            this.syncSelectedToList(this.worldItemTypes.find(desc => desc.type === this.selectedWorldItemType.type));
        }

        const meshDescriptor = this.worldItemTypes.find(descriptor => descriptor.type === type);
        this.selectedWorldItemType = cloneMeshDescriptor(meshDescriptor);

        if (this.controllers.renderController) {
            this.controllers.renderController.render();
        }
    }

    private syncSelectedToList(origWorldItemType: WorldItemType) {
        const clone = [...this.worldItemTypes];
        clone.splice(this.worldItemTypes.indexOf(origWorldItemType), 1, cloneMeshDescriptor(this.selectedWorldItemType));
        this.worldItemTypes = clone;
    }
}
