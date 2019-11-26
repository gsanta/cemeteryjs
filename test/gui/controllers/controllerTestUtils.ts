import { ControllerFacade } from "../../../src/gui/controllers/ControllerFacade";
import { FileFormat } from '../../../src/WorldGenerator';
import { TextCanvasController, initialText } from '../../../src/gui/controllers/canvases/text/TextCanvasController';
import { SvgCanvasController, initialSvg } from '../../../src/gui/controllers/canvases/svg/SvgCanvasController';


const testMap = 
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

W = wall ROLES [BORDER] MOD wall.babylon SHAPE rect SCALE 3 TRANSLATE_Y 2 MAT [wall.jpg]
D = door ROLES [BORDER] MOD models/door/door.babylon SCALE 3 TRANSLATE_Y 2 MAT [materials/door/door.jpg]
I = window ROLES [BORDER]
- = room ROLES [CONTAINER]
* = outdoors ROLES [CONTAINER]
T = table MOD table.babylon SHAPE rect SCALE 3 TRANSLATE_Y 2 MAT [table.jpg]

\`
`;

export function setupControllers(fileFormat: FileFormat, worldMap?: string): ControllerFacade {
    const controllers = new ControllerFacade();

    if (fileFormat === FileFormat.TEXT) {
        controllers.settingsModel.activeEditor = controllers.editors.find(editor => editor.getId() === TextCanvasController.id);
        worldMap = worldMap ? worldMap : testMap;
    } else if (fileFormat === FileFormat.SVG) {
        controllers.settingsModel.activeEditor = controllers.editors.find(editor => editor.getId() === SvgCanvasController.id);
        worldMap = worldMap ? worldMap : initialSvg;
    }

    controllers.webglCanvasController.unregisterEvents();

    controllers.settingsModel.activeEditor.writer.write(worldMap, fileFormat);

    return controllers;
}