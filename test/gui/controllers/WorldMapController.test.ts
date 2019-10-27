import { setupControllers } from "./controllerTestUtils";

it ('Assemble a world map (map, definitions, etc.)', () => {
    const controllers = setupControllers();

    expect(controllers.worldMapController.getMap()).toEqual(
`
map \`

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

\`

definitions \`

W = wall BORDER MOD wall.babylon MAT [ wall.jpg] SCALE 3
D = door MOD door.babylon MAT [ door.jpg] SCALE 3
- = room
* = outdoors
T = table MOD table.babylon MAT [ table.jpg] SCALE 3

\`
`
    );
});