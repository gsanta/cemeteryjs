import { setupControllers } from "../../../../guiTestUtils";

it ('Draw a rectangle shape', () => {
    const controllers = setupControllers(); 
    const canvasController = controllers.svgCanvasController;
    canvasController.pixelModel.clear();

    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 25, y: 15});
    canvasController.mouseController.onMouseUp(<MouseEvent> {x: 25, y: 15});


    expect(canvasController.pixelModel.items.length).toEqual(1);

    const expectedObj = { 
        indexes: [0, 1],
        layer: 0,
        type: 'wall'
    };
    expect(canvasController.pixelModel.items[0]).toEqual(expect.objectContaining(expectedObj));
});