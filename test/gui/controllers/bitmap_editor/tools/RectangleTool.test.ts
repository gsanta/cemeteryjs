import { setupControllers } from "../../../guiTestUtils";
import { Point } from "@nightshifts.inc/geometry";


it ('Draw pixels with mouse click', () => {
    const controllers = setupControllers(); 

    controllers.bitmapEditorController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditorController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditorController.mouseController.onMouseUp(<MouseEvent> {x: 5, y: 5});

    expect(controllers.bitmapEditorController.model.pixels.pixels.length).toEqual(1);
    let pixel = controllers.bitmapEditorController.model.pixels.pixels[0];
    expect(controllers.bitmapEditorController.model.pixels.getPixelPosition(pixel.index)).toEqual(new Point(0, 0));

    controllers.bitmapEditorController.model.pixels.clear();

    controllers.bitmapEditorController.mouseController.onMouseMove(<MouseEvent> {x: 20, y: 15});
    controllers.bitmapEditorController.mouseController.onMouseDown(<MouseEvent> {x: 20, y: 15});
    controllers.bitmapEditorController.mouseController.onMouseUp(<MouseEvent> {x: 20, y: 15});

    expect(controllers.bitmapEditorController.model.pixels.pixels.length).toEqual(1);
    pixel = controllers.bitmapEditorController.model.pixels.pixels[0];
    expect(controllers.bitmapEditorController.model.pixels.getPixelPosition(pixel.index)).toEqual(new Point(2, 1));
});

it ('Draw pixels with rectangle selection', () => {
    const controllers = setupControllers(); 

    controllers.bitmapEditorController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditorController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditorController.mouseController.onMouseMove(<MouseEvent> {x: 25, y: 15});
    controllers.bitmapEditorController.mouseController.onMouseUp(<MouseEvent> {x: 25, y: 15});

    expect(controllers.bitmapEditorController.model.pixels.pixels.length).toEqual(6);

    expect(controllers.bitmapEditorController.model.pixels.getPixelPosition(0)).toEqual(new Point(0, 0));
    expect(controllers.bitmapEditorController.model.pixels.getPixelPosition(1)).toEqual(new Point(1, 0));
    expect(controllers.bitmapEditorController.model.pixels.getPixelPosition(2)).toEqual(new Point(2, 0));
    expect(controllers.bitmapEditorController.model.pixels.getPixelPosition(150)).toEqual(new Point(0, 1));
    expect(controllers.bitmapEditorController.model.pixels.getPixelPosition(151)).toEqual(new Point(1, 1));
    expect(controllers.bitmapEditorController.model.pixels.getPixelPosition(152)).toEqual(new Point(2, 1));
});

it ('Remove existing pixel if adding pixel to an occupied position', () => {
    const controllers = setupControllers(); 

    controllers.bitmapEditorController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditorController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditorController.mouseController.onMouseUp(<MouseEvent> {x: 5, y: 5});

    expect(controllers.bitmapEditorController.model.pixels.pixels.length).toEqual(1);
    let pixel = controllers.bitmapEditorController.model.pixels.pixels[0];
    expect(pixel.type).toEqual('wall');
    controllers.worldItemDefinitionController.setSelectedDefinition('door');

    controllers.bitmapEditorController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditorController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditorController.mouseController.onMouseUp(<MouseEvent> {x: 5, y: 5});

    expect(controllers.bitmapEditorController.model.pixels.pixels.length).toEqual(1);
    pixel = controllers.bitmapEditorController.model.pixels.pixels[0];
    expect(pixel.type).toEqual('door');
});
