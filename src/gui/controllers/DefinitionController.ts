import { MeshDescriptor } from "../../Config";
import { ControllerFacade } from "./ControllerFacade";
import { FormController } from './FormController';

export enum DefinitionProperty {
    TYPE = 'type', CHAR = 'char', MODEL = 'model', SHAPE = 'shape', SCALE = 'scale', TRANSLATE_Y = 'translateY', MATERIALS = 'materials', IS_BORDER = 'isBorder'
}

function cloneMeshDescriptor(descriptor: MeshDescriptor) {
    const clone = {...descriptor};

    if (clone.materials) {
        clone.materials = [...clone.materials];
    }

    return clone;
}

export class DefinitionController implements FormController<DefinitionProperty> {
    shapes: string[] = ['rect'];

    meshDescriptors: MeshDescriptor[];
    selectedMeshDescriptor: MeshDescriptor;

    private controllers: ControllerFacade;

    constructor(controllers: ControllerFacade, meshDescriptors: MeshDescriptor[]) {
        this.controllers = controllers;
        this.meshDescriptors = meshDescriptors;
        this.setSelectedDefinition(this.meshDescriptors[0].type);
    }

    private tempString: string;
    private tempBoolean: boolean;
    private tempNumber: number;
    focusedPropType: DefinitionProperty;

    focusProp(type: DefinitionProperty) {
        this.focusedPropType = type;
        switch(this.focusedPropType) {
            case DefinitionProperty.MODEL:
                this.tempString = this.selectedMeshDescriptor.model;
                break;
            case DefinitionProperty.CHAR:
                this.tempString = this.selectedMeshDescriptor.char;
                break;
            case DefinitionProperty.TYPE:
                this.tempString = this.selectedMeshDescriptor.type;
                break;
            case DefinitionProperty.IS_BORDER:
                this.tempBoolean = this.selectedMeshDescriptor.isBorder;
                break;
            case DefinitionProperty.SCALE:
                this.tempNumber = this.selectedMeshDescriptor.scale;
                break;
            case DefinitionProperty.SHAPE:
                this.tempString = this.selectedMeshDescriptor.shape;
                break;
            case DefinitionProperty.TRANSLATE_Y:
                this.tempNumber = this.selectedMeshDescriptor.translateY;
                break;
            case DefinitionProperty.MATERIALS:
                this.tempString = "";
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

    updateNumberProp(value: number) {
        this.tempNumber = value;
        this.controllers.renderController.render();            
    }

    deletItemFromListProp(prop: DefinitionProperty, index: number) {
        switch(prop) {
            case DefinitionProperty.MATERIALS:
                this.selectedMeshDescriptor.materials.splice(index, 1);
                this.syncSelectedToList(this.meshDescriptors.find(desc => desc.type === this.selectedMeshDescriptor.type));
                break;
        } 

        this.controllers.renderController.render();
    }

    commitProp() {
        const origMeshDescriptor = this.meshDescriptors.find(desc => desc.type === this.selectedMeshDescriptor.type);

        switch(this.focusedPropType) {
            case DefinitionProperty.MODEL:
                this.selectedMeshDescriptor.model = this.tempString;
                break;
            case DefinitionProperty.CHAR:
                this.selectedMeshDescriptor.char = this.tempString;
                break;
            case DefinitionProperty.IS_BORDER:
                this.selectedMeshDescriptor.isBorder = this.tempBoolean;
                break;
            case DefinitionProperty.SCALE:
                this.selectedMeshDescriptor.scale = this.tempNumber;
                break;
            case DefinitionProperty.SHAPE:
                this.selectedMeshDescriptor.shape = this.tempString;
                break;
            case DefinitionProperty.TRANSLATE_Y:
                this.selectedMeshDescriptor.translateY = this.tempNumber;
                break;
            case DefinitionProperty.TYPE:
                this.selectedMeshDescriptor.type = this.tempString;
                break;
            case DefinitionProperty.MATERIALS:
                this.selectedMeshDescriptor.materials.push(this.tempString);
                this.tempString = '';
                this.focusedPropType = null;
                break;
        }

        this.syncSelectedToList(origMeshDescriptor);

        this.controllers.renderController.render();            
    }

    getVal(property: DefinitionProperty) {
        switch(property) {
            case DefinitionProperty.MODEL:
                return this.focusedPropType === property ? this.tempString : this.selectedMeshDescriptor.model;
            case DefinitionProperty.CHAR:
                return this.focusedPropType === property ? this.tempString : this.selectedMeshDescriptor.char;
            case DefinitionProperty.IS_BORDER:
                return this.focusedPropType === property ? this.tempBoolean : this.selectedMeshDescriptor.isBorder;
            case DefinitionProperty.SCALE:
                return this.focusedPropType === property ? this.tempNumber : this.selectedMeshDescriptor.scale;
            case DefinitionProperty.SHAPE:
                return this.focusedPropType === property ? this.tempString : this.selectedMeshDescriptor.shape;
            case DefinitionProperty.TRANSLATE_Y:
                return this.focusedPropType === property ? this.tempNumber : this.selectedMeshDescriptor.translateY;
            case DefinitionProperty.TYPE:
                return this.focusedPropType === property ? this.tempString : this.selectedMeshDescriptor.type;
            case DefinitionProperty.MATERIALS:
                return this.focusedPropType === property ? this.tempString : '';
        
        }
    }

    setSelectedDefinition(type: string) {
        if (this.selectedMeshDescriptor) {
            this.syncSelectedToList(this.meshDescriptors.find(desc => desc.type === this.selectedMeshDescriptor.type));
        }

        const meshDescriptor = this.meshDescriptors.find(descriptor => descriptor.type === type);
        this.selectedMeshDescriptor = cloneMeshDescriptor(meshDescriptor);

        if (this.controllers.renderController) {
            this.controllers.renderController.render();
        }
    }

    private syncSelectedToList(origMeshDescriptor: MeshDescriptor) {
        const clone = [...this.meshDescriptors];
        clone.splice(this.meshDescriptors.indexOf(origMeshDescriptor), 1, cloneMeshDescriptor(this.selectedMeshDescriptor));
        this.meshDescriptors = clone;
    }
}
