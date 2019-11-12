import { setupControllers } from '../controllerTestUtils';
import { Point } from '@nightshifts.inc/geometry';


it ('Add new pixels based on their canvas position', () => {
    const controllers = setupControllers();

    const bitmapEditor = controllers.bitmapEditorController;
    bitmapEditor.model.config.canvasDimensions = new Point(100, 50);
    bitmapEditor.model.config.pixelSize = 10;

    bitmapEditor.model.pixels.addPixel(new Point(5, 5), 'wall', false);
    expect(bitmapEditor.model.pixels.bitMap.has(0)).toBeTruthy();
    expect(bitmapEditor.model.pixels.bitMap.get(0)).toEqual({index: 0, type: 'wall', isPreview: false});

    bitmapEditor.model.pixels.addPixel(new Point(10, 9), 'door', false);
    expect(bitmapEditor.model.pixels.bitMap.has(1)).toBeTruthy();
    expect(bitmapEditor.model.pixels.bitMap.get(1)).toEqual({ index: 1, type: 'door', isPreview: false});

    bitmapEditor.model.pixels.addPixel(new Point(10, 10), 'window', false);
    expect(bitmapEditor.model.pixels.bitMap.has(11)).toBeTruthy();
    expect(bitmapEditor.model.pixels.bitMap.get(11)).toEqual({index: 11, type: 'window', isPreview: false});

    bitmapEditor.model.pixels.addPixel(new Point(31, 15), 'bed', false);
    expect(bitmapEditor.model.pixels.bitMap.has(13)).toBeTruthy();
    expect(bitmapEditor.model.pixels.bitMap.get(13)).toEqual({index: 13, type: 'bed', isPreview: false});
});