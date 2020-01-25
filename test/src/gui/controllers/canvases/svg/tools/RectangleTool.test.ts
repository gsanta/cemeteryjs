import { setupControllers } from "../../../../guiTestUtils";

it ('Draw a rectangle shape', () => {
    const controllers = setupControllers(); 
    const canvasController = controllers.svgCanvasController;
    canvasController.canvasStore.clear();

    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 25, y: 15});
    canvasController.mouseController.onMouseUp(<MouseEvent> {x: 25, y: 15});


    expect(canvasController.canvasStore.items.length).toEqual(1);

    const expectedObj = { 
        layer: 0,
        type: 'wall'
    };
    expect(canvasController.canvasStore.items[0]).toEqual(expect.objectContaining(expectedObj));
});