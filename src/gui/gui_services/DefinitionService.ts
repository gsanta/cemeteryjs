import { MeshDescriptor } from "../../Config";
import { ControllerFacade } from "../controllers/ControllerFacade";

export class DefinitionService {

    meshDescriptors: MeshDescriptor[] = [
        {
            type: 'wall',
            char: 'W',
            model: 'wall.babylon',
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

    // private createEmptyMeshDescriptor(): MeshDescriptor {
    //     return {

    //     }
    // }
}