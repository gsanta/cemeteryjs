import { setupControllers } from "../../../guiTestUtils";
import { Point } from "@nightshifts.inc/geometry";
import { SvgCanvasController } from "../../../../../src/gui/controllers/canvases/svg/SvgCanvasController";

it ('Draw pixels with mouse click', () => {
    const controllers = setupControllers(); 

    const canvasController = <SvgCanvasController> controllers.getCanvasControllerById(SvgCanvasController.id);
    canvasController.pixelModel.clear();

    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseUp(<MouseEvent> {x: 5, y: 5});

    expect(canvasController.pixelModel.pixels.length).toEqual(1);
    let pixel = canvasController.pixelModel.pixels[0];
    expect(canvasController.pixelModel.getPixelPosition(pixel.index)).toEqual(new Point(0, 0));

    canvasController.pixelModel.clear();

    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 20, y: 15});
    canvasController.mouseController.onMouseDown(<MouseEvent> {x: 20, y: 15});
    canvasController.mouseController.onMouseUp(<MouseEvent> {x: 20, y: 15});

    expect(canvasController.pixelModel.pixels.length).toEqual(1);
    pixel = canvasController.pixelModel.pixels[0];
    expect(canvasController.pixelModel.getPixelPosition(pixel.index)).toEqual(new Point(2, 1));
});

it ('Draw pixels with rectangle selection', () => {
    const controllers = setupControllers(); 
    const canvasController = <SvgCanvasController> controllers.getCanvasControllerById(SvgCanvasController.id);
    canvasController.pixelModel.clear();

    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 25, y: 15});
    canvasController.mouseController.onMouseUp(<MouseEvent> {x: 25, y: 15});

    expect(canvasController.pixelModel.pixels.length).toEqual(6);

    expect(canvasController.pixelModel.getPixelPosition(0)).toEqual(new Point(0, 0));
    expect(canvasController.pixelModel.getPixelPosition(1)).toEqual(new Point(1, 0));
    expect(canvasController.pixelModel.getPixelPosition(2)).toEqual(new Point(2, 0));
    expect(canvasController.pixelModel.getPixelPosition(150)).toEqual(new Point(0, 1));
    expect(canvasController.pixelModel.getPixelPosition(151)).toEqual(new Point(1, 1));
    expect(canvasController.pixelModel.getPixelPosition(152)).toEqual(new Point(2, 1));
});

it ('Remove existing pixel if adding pixel to an occupied position', () => {
    const controllers = setupControllers();
    const canvasController = <SvgCanvasController> controllers.getCanvasControllerById(SvgCanvasController.id);
    canvasController.pixelModel.clear();

    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseUp(<MouseEvent> {x: 5, y: 5});

    expect(canvasController.pixelModel.pixels.length).toEqual(1);
    let pixel = canvasController.pixelModel.pixels[0];
    expect(pixel.type).toEqual('wall');
    canvasController.worldItemDefinitionForm.setSelectedDefinition('door');

    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseUp(<MouseEvent> {x: 5, y: 5});

    expect(canvasController.pixelModel.pixels.length).toEqual(1);
    pixel = canvasController.pixelModel.pixels[0];
    expect(pixel.type).toEqual('door');
});
