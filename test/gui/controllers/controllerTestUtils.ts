import { ControllerFacade } from "../../../src/gui/controllers/ControllerFacade";
import { FileFormat } from '../../../src/WorldGenerator';
import { TextEditorController } from '../../../src/gui/controllers/editors/text/TextEditorController';
import { BitmapEditorController } from "../../../src/gui/controllers/editors/bitmap/BitmapEditorController";


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

W = wall BORDER MOD wall.babylon SHAPE rect SCALE 3 TRANSLATE_Y 2 MAT [wall.jpg]
D = door BORDER MOD models/door/door.babylon SCALE 3 TRANSLATE_Y 2 MAT [materials/door/door.jpg]
I = window BORDER
- = room
* = outdoors
T = table MOD table.babylon SHAPE rect SCALE 3 TRANSLATE_Y 2 MAT [table.jpg]

\`
`;

export function setupControllers(fileFormat: FileFormat, map = testMap): ControllerFacade {
    const controllers = new ControllerFacade();

    if (fileFormat === FileFormat.TEXT) {
        controllers.settingsModel.activeEditor = controllers.editors.find(editor => editor.getId() === TextEditorController.id);
    } else if (fileFormat === FileFormat.SVG) {
        controllers.settingsModel.activeEditor = controllers.editors.find(editor => editor.getId() === BitmapEditorController.id);
    }

    controllers.settingsModel.activeEditor.reader.read(map);

    return controllers;
}