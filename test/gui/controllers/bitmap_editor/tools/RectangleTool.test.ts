import { setupControllers } from "../../../guiTestUtils";
import { Point } from "@nightshifts.inc/geometry";


it ('Put down the appopriate colored pixel when clicking onto the canvas', () => {
    const controllers = setupControllers(); 

    controllers.bitmapEditor.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditor.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    controllers.bitmapEditor.mouseController.onMouseUp(<MouseEvent> {x: 5, y: 5});

    expect(controllers.bitmapEditor.pixelController.pixels.length).toEqual(1);
    let pixel = controllers.bitmapEditor.pixelController.pixels[0];
    expect(controllers.bitmapEditor.pixelController.getPixelPosition(pixel.index)).toEqual(new Point(0, 0));
    expect(controllers.bitmapEditor.pixelController.getAbsolutePosition(pixel.index)).toEqual(new Point(0, 0));

    controllers.bitmapEditor.pixelController.clear();

    controllers.bitmapEditor.mouseController.onMouseMove(<MouseEvent> {x: 20, y: 15});
    controllers.bitmapEditor.mouseController.onMouseDown(<MouseEvent> {x: 20, y: 15});
    controllers.bitmapEditor.mouseController.onMouseUp(<MouseEvent> {x: 20, y: 15});

    expect(controllers.bitmapEditor.pixelController.pixels.length).toEqual(1);
    pixel = controllers.bitmapEditor.pixelController.pixels[0];
    expect(controllers.bitmapEditor.pixelController.getPixelPosition(pixel.index)).toEqual(new Point(2, 1));
    expect(controllers.bitmapEditor.pixelController.getAbsolutePosition(pixel.index)).toEqual(new Point(20, 10));
});

// it ('Put down multiple colored pixels when making a rectangular selection', () => {
//     const controllers = setupControllers(); 

//     controllers.bitmapEditor.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
//     controllers.bitmapEditor.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
//     controllers.bitmapEditor.mouseController.onMouseMove(<MouseEvent> {x: 30, y: 22});
//     controllers.bitmapEditor.mouseController.onMouseUp(<MouseEvent> {x: 30, y: 22});

//     expect(controllers.bitmapEditor.pixelController.pixels.length).toEqual(1);
// });
