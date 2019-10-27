import { MeshDescriptor } from "../../Config";
import { ControllerFacade } from "./ControllerFacade";
import { FormController } from './FormController';

export enum DefinitionProperty {
    TYPE, CHAR, MODEL, SHAPE, SCALE, TRANSLATE_Y, MATERIALS, IS_BORDER
}

function cloneMeshDescriptor(descriptor: MeshDescriptor) {
    const clone = {...descriptor};
    clone.materials = [...clone.materials];

    return clone;
}

export class DefinitionController implements FormController<DefinitionProperty> {
    shapes: string[] = ['rect'];

    meshDescriptors: MeshDescriptor[] = [
        {
            type: 'wall',
            char: 'W',
            model: 'wall.babylon',
            shape: 'rect',
            scale: 3,
            translateY: 2,
            materials: ['wall.jpg'],
            isBorder: true
        },
        {
            type: 'door',
            char: 'D',
            model: 'door.babylon',
            scale: 3,
            translateY: 2,
            materials: ['door.jpg'],
            isBorder: false
        },
        {
            type: 'table',
            char: 'T',
            model: 'table.babylon',
            scale: 3,
            translateY: 2,
            materials: ['table.jpg'],
            isBorder: false
        },
        {
            type: 'window',
            char: 'W',
            model: 'window.babylon',
            shape: 'rect',
            scale: 3,
            translateY: 2,
            materials: ['window.jpg'],
            isBorder: false
        },
        {
            type: 'chair',
            char: 'D',
            model: 'chair.babylon',
            scale: 3,
            translateY: 2,
            materials: ['chair.jpg'],
            isBorder: false
        },
        {
            type: 'shelf',
            char: 'T',
            model: 'shelf.babylon',
            scale: 3,
            translateY: 2,
            materials: ['shelf.jpg'],
            isBorder: false
        },
        {
            type: 'cupboard',
            char: 'W',
            model: 'cupboard.babylon',
            shape: 'rect',
            scale: 3,
            translateY: 2,
            materials: ['cupboard.jpg'],
            isBorder: false
        },
        {
            type: 'stair',
            char: 'D',
            model: 'stair.babylon',
            scale: 3,
            translateY: 2,
            materials: ['stair.jpg'],
            isBorder: false
        },
        {
            type: 'bath',
            char: 'T',
            model: 'bath.babylon',
            scale: 3,
            translateY: 2,
            materials: ['bath.jpg'],
            isBorder: false
        }
    ];

    selectedMeshDescriptor: MeshDescriptor;

    private controllers: ControllerFacade;
    tmpMaterial: string;

    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.selectDefinitionByType(this.meshDescriptors[0].type);
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
                this.tmpMaterial = "";
                break;
        }
    }

    updateStringProp(value: string) {
        if (this.focusedPropType === DefinitionProperty.MATERIALS) {
            this.tmpMaterial = value;
        } else {
            this.tempString = value;        
        }
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

    commitProp() {
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
                this.selectedMeshDescriptor.materials.push(this.tmpMaterial);
                this.tmpMaterial = '';
                this.focusedPropType = null;
                break;
        }

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
                return this.focusedPropType === property ? this.tmpMaterial : '';
        
        }
    }

    deleteListItem(prop: DefinitionProperty, index: number) {
        switch(prop) {
            case DefinitionProperty.MATERIALS:
                this.selectedMeshDescriptor.materials.splice(index, 1);
                this.syncSelected();
                break;
        } 

        this.controllers.renderController.render();
    }

    selectDefinitionByType(type: string) {
        if (this.selectedMeshDescriptor) {
            this.syncSelected();
        }

        const meshDescriptor = this.meshDescriptors.find(descriptor => descriptor.type === type);
        this.selectedMeshDescriptor = cloneMeshDescriptor(meshDescriptor);

        if (this.controllers.renderController) {
            this.controllers.renderController.render();
        }
    }
  
    setTmpMaterial(path: string) {
        this.tmpMaterial = path;
        this.controllers.renderController.render();
    }

    saveTmpMaterial(): void {
        this.selectedMeshDescriptor.materials.push(this.tmpMaterial);
        this.tmpMaterial = '';
        this.controllers.renderController.render();
    }

    private syncSelected() {
        const clone = [...this.meshDescriptors];
        const descriptorToReplace = this.meshDescriptors.find(desc => desc.type === this.selectedMeshDescriptor.type);
        clone.splice(this.meshDescriptors.indexOf(descriptorToReplace), 1, this.selectedMeshDescriptor);
        this.meshDescriptors = clone;
    }
}
