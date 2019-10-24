import { MeshDescriptor } from "../../Config";
import { ControllerFacade } from "./ControllerFacade";

export class DefinitionController {
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

    setSelectedDescriptorByType(type: string) {
        const meshDescriptor = this.meshDescriptors.find(descriptor => descriptor.type === type);
        this.selectedMeshDescriptor = meshDescriptor;
        this.controllers.renderController.render();
    }


    setChar(character: string) {
        this.selectedMeshDescriptor.char = character;
        this.controllers.renderController.render();
    }

    setIsBorder(isBorder: boolean) {
        this.selectedMeshDescriptor.isBorder = isBorder;
        this.controllers.renderController.render();
    }

    setShape(shape: string) {
        this.selectedMeshDescriptor.shape = shape;
        this.controllers.renderController.render();
    }

    setScale(scale: number) {
        this.selectedMeshDescriptor.scale = scale;
        this.controllers.renderController.render();
    }

    setYTranslate(translateY: number) {
        this.selectedMeshDescriptor.translateY = translateY;
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