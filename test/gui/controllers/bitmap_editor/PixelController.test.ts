import { setupControllers } from '../controllerTestUtils';
import { Point } from '@nightshifts.inc/geometry';


it ('Add new pixels based on their canvas position', () => {
    const controllers = setupControllers();

    const bitmapEditor = controllers.bitmapEditor;
    bitmapEditor.config.canvasDimensions = new Point(100, 50);
    bitmapEditor.config.pixelSize = 10;

    bitmapEditor.pixelController.addPixel(new Point(5, 5), { color: 'green'});
    expect(bitmapEditor.pixelController.bitMap.has(0)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(0)).toEqual({ color: 'green'});

    bitmapEditor.pixelController.addPixel(new Point(10, 9), { color: 'yellow'});
    expect(bitmapEditor.pixelController.bitMap.has(1)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(1)).toEqual({ color: 'yellow'});

    bitmapEditor.pixelController.addPixel(new Point(10, 10), { color: 'brown'});
    expect(bitmapEditor.pixelController.bitMap.has(11)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(11)).toEqual({ color: 'brown'});

    bitmapEditor.pixelController.addPixel(new Point(31, 15), { color: 'red'});
    expect(bitmapEditor.pixelController.bitMap.has(13)).toBeTruthy();
    expect(bitmapEditor.pixelController.bitMap.get(13)).toEqual({ color: 'red'});
});