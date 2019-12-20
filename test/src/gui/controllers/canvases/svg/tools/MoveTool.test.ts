import { setupControllers, drawRectangle, click, drag } from '../../../../guiTestUtils';
import { Polygon } from '../../../../../../../src/model/geometry/shapes/Polygon';
import { Point } from '../../../../../../../src/model/geometry/shapes/Point';
import { ToolType } from '../../../../../../../src/editor/controllers/formats/svg/tools/Tool';

it ('Move a canvas item', () => {
    const controllers = setupControllers(); 

    const canvasItem = drawRectangle(controllers);

    controllers.svgCanvasController.setActiveTool(ToolType.MOVE_AND_SELECT);
    click(controllers, canvasItem);

    expect(canvasItem.polygon).toBeEqualDimensions(new Polygon([new Point(5, 5), new Point(5, 14), new Point(24, 14), new Point(24, 5)]));

    const center = canvasItem.polygon.getBoundingCenter().mul(controllers.svgCanvasController.configModel.pixelSize);
    drag(controllers, center, center.addX(100).addY(50));

    expect(canvasItem.polygon).toBeEqualDimensions(new Polygon([new Point(15, 10), new Point(15, 19), new Point(34, 19), new Point(34, 10)]));
});