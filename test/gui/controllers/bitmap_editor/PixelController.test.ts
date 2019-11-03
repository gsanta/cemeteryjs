import { setupControllers } from '../controllerTestUtils';
import { Point } from '@nightshifts.inc/geometry';


it ('Add new pixels based on their canvas position', () => {
    const controllers = setupControllers();

    const bitmapEditor = controllers.bitmapEditor;
    bitmapEditor.config.canvasDimensions = new Point(100, 50);
    bitmapEditor.config.pixelSize = 10;

    bitmapEditor.pixelController.addPixel(new Point(5, 5), { type: 'wall'});
    expect(bitmapEditor.pixelController.bitMap.has(0)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(0)).toEqual({ type: 'wall'});

    bitmapEditor.pixelController.addPixel(new Point(10, 9), { type: 'door'});
    expect(bitmapEditor.pixelController.bitMap.has(1)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(1)).toEqual({ type: 'door'});

    bitmapEditor.pixelController.addPixel(new Point(10, 10), { type: 'window'});
    expect(bitmapEditor.pixelController.bitMap.has(11)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(11)).toEqual({ type: 'window'});

    bitmapEditor.pixelController.addPixel(new Point(31, 15), { type: 'bed'});
    expect(bitmapEditor.pixelController.bitMap.has(13)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(13)).toEqual({ type: 'bed'});
});