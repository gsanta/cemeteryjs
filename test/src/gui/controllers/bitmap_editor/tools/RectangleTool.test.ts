import { setupControllers } from "../../../guiTestUtils";
import { Point } from "@nightshifts.inc/geometry";
import { SvgCanvasController } from "../../../../../../src/gui/controllers/canvases/svg/SvgCanvasController";
import { GameObjectTemplate } from '../../../../../../src/model/types/GameObjectTemplate';

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


    expect(canvasController.pixelModel.items.length).toEqual(1);

    const expectedObj = { 
        indexes: [0, 1],
        layer: -1,
        type: 'wall'
    };
    expect(canvasController.pixelModel.items[0]).toEqual(expect.objectContaining(expectedObj));
});

it ('Do not remove existing pixel if adding pixel to an occupied position', () => {
    const controllers = setupControllers();
    const canvasController = <SvgCanvasController> controllers.getCanvasControllerById(SvgCanvasController.id);
    canvasController.pixelModel.clear();

    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseUp(<MouseEvent> {x: 5, y: 5});

    expect(canvasController.pixelModel.pixels.length).toEqual(1);
    let pixel = canvasController.pixelModel.pixels[0];
    expect(pixel.type).toEqual('wall');
    canvasController.selectedWorldItemDefinition = GameObjectTemplate.getByTypeName('door', canvasController.worldItemDefinitions);

    canvasController.mouseController.onMouseMove(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseDown(<MouseEvent> {x: 5, y: 5});
    canvasController.mouseController.onMouseUp(<MouseEvent> {x: 5, y: 5});

    expect(canvasController.pixelModel.pixels.length).toEqual(2);
    pixel = canvasController.pixelModel.pixels[1];
    expect(pixel.type).toEqual('door');
});
