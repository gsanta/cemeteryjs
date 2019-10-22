import { MeshDescriptor } from "../../Config";

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
            char: 'W',
            model: 'wall.babylon',
            scale: 3,
            translateY: 2,
            materials: ['wall.jpg'],
            isBorder: false
        },
        {
            type: 'table',
            char: 'W',
            model: 'wall.babylon',
            scale: 3,
            translateY: 2,
            materials: ['wall.jpg'],
            isBorder: false
        }
    ];
}