import { ControllerFacade } from "../../../../src/editor/controllers/ControllerFacade";
import { initialSvg } from "../../../../src/editor/controllers/formats/svg/SvgCanvasController";

export function setupControllers(worldMap?: string): ControllerFacade {
    const controllers = new ControllerFacade();

    worldMap = worldMap ? worldMap : initialSvg;

    controllers.webglCanvasController.unregisterEvents();

    controllers.svgCanvasController.writer.write(worldMap);

    return controllers;
}