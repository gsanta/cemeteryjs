
import { setupControllers, drawRectangle, selectWithClick } from '../../../../guiTestUtils';
import { PixelTag } from "../../../../../../../src/gui/controllers/canvases/svg/models/GridCanvasStore";
import { ToolType } from "../../../../../../../src/gui/controllers/canvases/svg/tools/Tool";
import { Point } from '../../../../../../../src/geometry/shapes/Point';

it ('Select via clicking on an item', () => {
    const controllers = setupControllers(); 
    const canvasController = controllers.svgCanvasController;
    canvasController.pixelModel.clear();

    drawRectangle(controllers);

    expect(canvasController.pixelModel.items[0].tags.includes(PixelTag.SELECTED)).toBeFalsy();

    canvasController.setActiveTool(ToolType.SELECT);

    selectWithClick(controllers, new Point(100, 100));

    expect(canvasController.pixelModel.items[0].tags.includes(PixelTag.SELECTED)).toBeTruthy();
});