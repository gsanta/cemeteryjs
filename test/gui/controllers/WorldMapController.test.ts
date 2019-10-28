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

W = wall BORDER MOD wall.babylon MAT [ wall.jpg] SCALE 3 TRANS_Y 2
D = door MOD models/door/door.babylon MAT [ materials/door/door.jpg] SCALE 3 TRANS_Y 2
- = room
* = outdoors
T = table MOD table.babylon MAT [ table.jpg] SCALE 3 TRANS_Y 2

\`
`
    );
});