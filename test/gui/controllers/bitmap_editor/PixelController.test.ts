import { setupControllers } from '../controllerTestUtils';
import { Point } from '@nightshifts.inc/geometry';


it ('Add new pixels based on their canvas position', () => {
    const controllers = setupControllers();

    const bitmapEditor = controllers.bitmapEditor;
    bitmapEditor.config.canvasDimensions = new Point(100, 50);
    bitmapEditor.config.pixelSize = 10;

    bitmapEditor.pixelController.addPreview(new Point(5, 5), 'wall');
    expect(bitmapEditor.pixelController.bitMap.has(0)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(0)).toEqual({index: 0, type: 'wall'});

    bitmapEditor.pixelController.addPreview(new Point(10, 9), 'door');
    expect(bitmapEditor.pixelController.bitMap.has(1)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(1)).toEqual({ index: 1, type: 'door'});

    bitmapEditor.pixelController.addPreview(new Point(10, 10), 'window');
    expect(bitmapEditor.pixelController.bitMap.has(11)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(11)).toEqual({index: 11, type: 'window'});

    bitmapEditor.pixelController.addPreview(new Point(31, 15), 'bed');
    expect(bitmapEditor.pixelController.bitMap.has(13)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(13)).toEqual({index: 13, type: 'bed'});
});