import { ControllerFacade } from "../../../../src/gui/controllers/ControllerFacade";
import { initialSvg } from "../../../../src/gui/controllers/canvases/svg/SvgCanvasController";

export function setupControllers(worldMap?: string): ControllerFacade {
    const controllers = new ControllerFacade();

    worldMap = worldMap ? worldMap : initialSvg;

    controllers.webglCanvasController.unregisterEvents();

    controllers.svgCanvasController.writer.write(worldMap);

    return controllers;
}