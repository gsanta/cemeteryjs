import { setupControllers } from "../../../guiTestUtils";
import { Point } from "@nightshifts.inc/geometry";


it ('Draw pixels with mouse click', () => {
    const controllers = setupControllers(); 

    controllers.bitmapEditor.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditor.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditor.mouseController.onMouseUp(<MouseEvent> {x: 5, y: 5});

    expect(controllers.bitmapEditor.pixelController.pixels.length).toEqual(1);
    let pixel = controllers.bitmapEditor.pixelController.pixels[0];
    expect(controllers.bitmapEditor.pixelController.getPixelPosition(pixel.index)).toEqual(new Point(0, 0));

    controllers.bitmapEditor.pixelController.clear();

    controllers.bitmapEditor.mouseController.onMouseMove(<MouseEvent> {x: 20, y: 15});
    controllers.bitmapEditor.mouseController.onMouseDown(<MouseEvent> {x: 20, y: 15});
    controllers.bitmapEditor.mouseController.onMouseUp(<MouseEvent> {x: 20, y: 15});

    expect(controllers.bitmapEditor.pixelController.pixels.length).toEqual(1);
    pixel = controllers.bitmapEditor.pixelController.pixels[0];
    expect(controllers.bitmapEditor.pixelController.getPixelPosition(pixel.index)).toEqual(new Point(2, 1));
});

it ('Draw pixels with rectangle selection', () => {
    const controllers = setupControllers(); 

    controllers.bitmapEditor.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditor.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditor.mouseController.onMouseMove(<MouseEvent> {x: 25, y: 15});
    controllers.bitmapEditor.mouseController.onMouseUp(<MouseEvent> {x: 25, y: 15});

    expect(controllers.bitmapEditor.pixelController.pixels.length).toEqual(6);

    expect(controllers.bitmapEditor.pixelController.getPixelPosition(0)).toEqual(new Point(0, 0));
    expect(controllers.bitmapEditor.pixelController.getPixelPosition(1)).toEqual(new Point(1, 0));
    expect(controllers.bitmapEditor.pixelController.getPixelPosition(2)).toEqual(new Point(2, 0));
    expect(controllers.bitmapEditor.pixelController.getPixelPosition(150)).toEqual(new Point(0, 1));
    expect(controllers.bitmapEditor.pixelController.getPixelPosition(151)).toEqual(new Point(1, 1));
    expect(controllers.bitmapEditor.pixelController.getPixelPosition(152)).toEqual(new Point(2, 1));
});

it ('Remove existing pixel if adding pixel to an occupied position', () => {
    const controllers = setupControllers(); 

    controllers.bitmapEditor.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditor.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditor.mouseController.onMouseUp(<MouseEvent> {x: 5, y: 5});

    expect(controllers.bitmapEditor.pixelController.pixels.length).toEqual(1);
    let pixel = controllers.bitmapEditor.pixelController.pixels[0];
    expect(pixel.type).toEqual('wall');
    controllers.worldItemTypeController.setSelectedDefinition('door');

    controllers.bitmapEditor.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditor.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditor.mouseController.onMouseUp(<MouseEvent> {x: 5, y: 5});

    expect(controllers.bitmapEditor.pixelController.pixels.length).toEqual(1);
    pixel = controllers.bitmapEditor.pixelController.pixels[0];
    expect(pixel.type).toEqual('door');
});
