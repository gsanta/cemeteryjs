import { MeshDescriptor } from "../../Config";
import { ControllerFacade } from "./ControllerFacade";
import { FormController } from './FormController';

export enum DefinitionProperty {
    TYPE, CHAR, MODEL, SHAPE, SCALE, TRANSLATE_Y, MATERIALS, IS_BORDER
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
            isBorder: false
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
            type: 'wall',
            char: 'W',
            model: 'wall.babylon',
            shape: 'rect',
            scale: 3,
            translateY: 2,
            materials: ['wall.jpg'],
            isBorder: false
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
            type: 'wall',
            char: 'W',
            model: 'wall.babylon',
            shape: 'rect',
            scale: 3,
            translateY: 2,
            materials: ['wall.jpg'],
            isBorder: false
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
        }
    ];

    selectedMeshDescriptor: MeshDescriptor = this.meshDescriptors[0];

    private controllers: ControllerFacade;
    tmpMaterial: string;

    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
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
        }

        this.controllers.renderController.render();            
    }

    getVal(property: DefinitionProperty) {
        if (property === this.focusedPropType) {
            return this.tempString;
        }

        switch(property) {
            case DefinitionProperty.MODEL:
                return this.selectedMeshDescriptor.model;
            case DefinitionProperty.CHAR:
                return this.selectedMeshDescriptor.char;
            case DefinitionProperty.IS_BORDER:
                return this.selectedMeshDescriptor.isBorder;
            case DefinitionProperty.SCALE:
                return this.selectedMeshDescriptor.scale;
            case DefinitionProperty.SHAPE:
                return this.selectedMeshDescriptor.shape;
            case DefinitionProperty.TRANSLATE_Y:
                return this.selectedMeshDescriptor.translateY;
            case DefinitionProperty.TYPE:
                return this.selectedMeshDescriptor.type;
        }
    }

    setSelectedDescriptorByType(type: string) {
        const meshDescriptor = this.meshDescriptors.find(descriptor => descriptor.type === type);
        this.selectedMeshDescriptor = meshDescriptor;
        this.controllers.renderController.render();
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
}
