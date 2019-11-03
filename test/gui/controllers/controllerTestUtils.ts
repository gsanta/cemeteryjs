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

const testWorldItemTypes = [
    {
        typeName: 'wall',
        char: 'W',
        model: 'wall.babylon',
        shape: 'rect',
        scale: 3,
        translateY: 2,
        materials: ['wall.jpg'],
        isBorder: true
    },
    {
        typeName: 'door',
        char: 'D',
        model: 'models/door/door.babylon',
        scale: 3,
        translateY: 2,
        materials: ['materials/door/door.jpg'],
        isBorder: false
    },
    {
        typeName: 'room',
        char: '-',
        isBorder: false
    },
    {
        typeName: 'outdoors',
        char: '*',
        isBorder: false
    },
    {
        typeName: 'table',
        char: 'T',
        model: 'table.babylon',
        shape: 'rect',
        scale: 3,
        translateY: 2,
        materials: ['table.jpg'],
        isBorder: false
    }
] 

export function setupControllers(map = testMap, meshDescriptors = testWorldItemTypes): ControllerFacade {
    const controllers = new ControllerFacade();
    controllers.textEditorController.text = map;
    controllers.worldItemTypeController.getModel().types = meshDescriptors;

    return controllers;
}