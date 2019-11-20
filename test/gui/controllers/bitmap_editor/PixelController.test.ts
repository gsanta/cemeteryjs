import { setupControllers } from '../controllerTestUtils';
import { Point } from '@nightshifts.inc/geometry';
import { FileFormat } from '../../../../src/WorldGenerator';
import { SvgCanvasController } from '../../../../src/gui/controllers/canvases/svg/SvgCanvasController';


it ('Add new pixels based on their canvas position', () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const canvasController = <SvgCanvasController> controllers.getCanvasControllerById(SvgCanvasController.id);
    canvasController.configModel.canvasDimensions = new Point(100, 50);
    canvasController.configModel.pixelSize = 10;

    canvasController.pixelModel.addPixel(new Point(5, 5), 'wall', false, 0);
    expect(canvasController.pixelModel.bitMap.has(0)).toBeTruthy();
    expect(canvasController.pixelModel.bitMap.get(0)).toEqual({index: 0, type: 'wall', isPreview: false, zOrder: 0});

    canvasController.pixelModel.addPixel(new Point(10, 9), 'door', false, 0);
    expect(canvasController.pixelModel.bitMap.has(1)).toBeTruthy();
    expect(canvasController.pixelModel.bitMap.get(1)).toEqual({ index: 1, type: 'door', isPreview: false, zOrder: 0});

    canvasController.pixelModel.addPixel(new Point(10, 10), 'window', false, 0);
    expect(canvasController.pixelModel.bitMap.has(11)).toBeTruthy();
    expect(canvasController.pixelModel.bitMap.get(11)).toEqual({index: 11, type: 'window', isPreview: false, zOrder: 0});

    canvasController.pixelModel.addPixel(new Point(31, 15), 'bed', false, 0);
    expect(canvasController.pixelModel.bitMap.has(13)).toBeTruthy();
    expect(canvasController.pixelModel.bitMap.get(13)).toEqual({index: 13, type: 'bed', isPreview: false, zOrder: 0});
});