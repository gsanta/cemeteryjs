import { setupControllers, drawRectangle, selectWithRect, click } from "../../../../guiTestUtils";
import { Point } from "../../../../../../../src/model/geometry/shapes/Point";
import { ToolType } from "../../../../../../../src/editor/controllers/canvases/svg/tools/Tool";

it ('Delete via clicking on an item', () => {
    const controllers = setupControllers(); 
    const canvasController = controllers.svgCanvasController;
    controllers.viewStore.clear();

    const canvasItem = drawRectangle(controllers);

    canvasController.setActiveTool(ToolType.DELETE);

    expect(controllers.viewStore.getViews().length).toEqual(1);

    click(controllers, canvasItem);

    expect(controllers.viewStore.getViews().length).toEqual(0);
});


it ('Delete via rectangle selection', () => {
    const controllers = setupControllers(); 
    const canvasController = controllers.svgCanvasController;
    controllers.viewStore.clear();

    drawRectangle(controllers, new Point(50, 50), new Point(100, 100));
    drawRectangle(controllers, new Point(150, 40), new Point(170, 80));
    drawRectangle(controllers, new Point(200, 50), new Point(250, 300));

    canvasController.setActiveTool(ToolType.DELETE);

    controllers.svgCanvasRenderer.reset();

    expect(controllers.viewStore.getViews().length).toEqual(3);

    selectWithRect(controllers, new Point(40, 40), new Point(180, 100));

    expect(controllers.viewStore.getViews().length).toEqual(1);
    expect(controllers.svgCanvasRenderer.counter).toEqual(3);
});