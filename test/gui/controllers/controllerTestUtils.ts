import { ControllerFacade } from "../../../src/gui/controllers/ControllerFacade";


const testMap = 
`
***********************************
*WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW*
*W-------------------------------W*
*W-------------------------------W*
*W-------------------------------W*
*W-------------------------------W*
*WTTTTTT-------------------------W*
*WTTTTTT-------------------------W*
*W-------------------------------W*
*W-------------------------------W*
*WWWWWWWWWWWWWWWWWWWWWDDDDDWWWWWWW*
***********************************
`;

const testMeshDescriptors = [
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
        model: 'models/door/door.babylon',
        scale: 3,
        translateY: 2,
        materials: ['materials/door/door.jpg'],
        isBorder: false
    },
    {
        type: 'room',
        char: '-',
        isBorder: false
    },
    {
        type: 'outdoors',
        char: '*',
        isBorder: false
    },
    {
        type: 'table',
        char: 'T',
        model: 'table.babylon',
        shape: 'rect',
        scale: 3,
        translateY: 2,
        materials: ['table.jpg'],
        isBorder: false
    }
] 

export function setupControllers(map = testMap, meshDescriptors = testMeshDescriptors): ControllerFacade {
    const controllers = new ControllerFacade();
    controllers.textEditorController.text = map;
    controllers.definitionController.meshDescriptors = meshDescriptors;

    return controllers;
}