import { PropController } from "../../../core/plugin/controller/FormController";

export enum GameViewerProps {
    Play = 'Play',
    Stop = 'Stop'
}

export class PlayController extends PropController {

    constructor() {
        super(GameViewerProps.Play);
    }

    click(context) {
        context.registry.services.game.isPlaying = true;
        context.registry.services.render.reRender(context.plugin.region);
    }
}

export class StopController extends PropController {

    constructor() {
        super(GameViewerProps.Stop);
    }

    click(context) {
        context.registry.services.game.isPlaying = false;
        context.registry.services.render.reRender(context.plugin.region);
    }
}