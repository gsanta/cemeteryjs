import { setupControllers } from "../../../../guiTestUtils";

it ('Draw a rectangle shape', () => {
    const controllers = setupControllers(); 
    const canvasController = controllers.svgCanvasController;
    controllers.viewStore.clear();

    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 25, y: 15});
    canvasController.mouseController.onMouseUp(<MouseEvent> {x: 25, y: 15});


    expect(controllers.viewStore.getViews().length).toEqual(1);

    const expectedObj = { 
        layer: 0,
        type: 'wall'
    };
    expect(controllers.viewStore.getViews()[0]).toEqual(expect.objectContaining(expectedObj));
});