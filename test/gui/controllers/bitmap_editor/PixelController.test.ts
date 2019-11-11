import { setupControllers } from '../controllerTestUtils';
import { Point } from '@nightshifts.inc/geometry';


it ('Add new pixels based on their canvas position', () => {
    const controllers = setupControllers();

    const bitmapEditor = controllers.bitmapEditorController;
    bitmapEditor.config.canvasDimensions = new Point(100, 50);
    bitmapEditor.config.pixelSize = 10;

    bitmapEditor.pixelController.addPixel(new Point(5, 5), 'wall', false);
    expect(bitmapEditor.pixelController.bitMap.has(0)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(0)).toEqual({index: 0, type: 'wall', isPreview: false});

    bitmapEditor.pixelController.addPixel(new Point(10, 9), 'door', false);
    expect(bitmapEditor.pixelController.bitMap.has(1)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(1)).toEqual({ index: 1, type: 'door', isPreview: false});

    bitmapEditor.pixelController.addPixel(new Point(10, 10), 'window', false);
    expect(bitmapEditor.pixelController.bitMap.has(11)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(11)).toEqual({index: 11, type: 'window', isPreview: false});

    bitmapEditor.pixelController.addPixel(new Point(31, 15), 'bed', false);
    expect(bitmapEditor.pixelController.bitMap.has(13)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(13)).toEqual({index: 13, type: 'bed', isPreview: false});
});