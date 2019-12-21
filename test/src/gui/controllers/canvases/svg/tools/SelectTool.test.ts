
import { setupControllers, drawRectangle, click, selectWithRect } from '../../../../guiTestUtils';
import { ToolType } from "../../../../../../../src/editor/controllers/formats/svg/tools/Tool";
import { Point } from '../../../../../../../src/model/geometry/shapes/Point';
import { CanvasItemTag } from '../../../../../../../src/editor/controllers/formats/svg/models/CanvasItem';

it ('Select via clicking on an item', () => {
    const controllers = setupControllers(); 
    const canvasController = controllers.svgCanvasController;
    canvasController.pixelModel.clear();

    const canvasItem = drawRectangle(controllers);

    expect(canvasController.pixelModel.items[0].tags.has(CanvasItemTag.SELECTED)).toBeFalsy();

    canvasController.setActiveTool(ToolType.MOVE_AND_SELECT);

    click(controllers, canvasItem);

    expect(canvasController.pixelModel.items[0].tags.has(CanvasItemTag.SELECTED)).toBeTruthy();
});

it ('Select via rectangle selection', () => {
    const controllers = setupControllers(); 
    const canvasController = controllers.svgCanvasController;
    canvasController.pixelModel.clear();

    drawRectangle(controllers, new Point(50, 50), new Point(100, 100));
    drawRectangle(controllers, new Point(150, 40), new Point(170, 80));
    drawRectangle(controllers, new Point(200, 50), new Point(250, 300));

    canvasController.setActiveTool(ToolType.MOVE_AND_SELECT);

    controllers.svgCanvasRenderer.reset();

    selectWithRect(controllers, new Point(40, 40), new Point(180, 100));

    const selectedItems = CanvasItemTag.getSelectedItems(canvasController.pixelModel.items);

    expect(selectedItems.length).toEqual(2);
    expect(controllers.svgCanvasRenderer.counter).toEqual(3);
});