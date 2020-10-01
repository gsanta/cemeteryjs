import { PropController } from "../../../core/plugin/controller/FormController";
import { GameViewerPlugin } from "./GameViewerPlugin";

export enum GameViewerProps {
    Play = 'Play',
    Stop = 'Stop'
}

export class PlayController extends PropController {

    constructor() {
        super(GameViewerProps.Play);
    }

    click(context) {
        (<GameViewerPlugin> context.plugin).isPlaying = true;
        context.registry.services.render.reRender(context.plugin.region);
    }
}

export class StopController extends PropController {

    constructor() {
        super(GameViewerProps.Stop);
    }

    click(context) {
        (<GameViewerPlugin> context.plugin).isPlaying = false;
        context.registry.services.render.reRender(context.plugin.region);
    }
}