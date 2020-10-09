import { PropController } from "../../../core/plugin/controller/FormController";

export enum GameViewerProps {
    Play = 'Play',
    Stop = 'Stop'
}

export class PlayController extends PropController {
    acceptedProps() { return [GameViewerProps.Play]; }

    click(context) {
        context.registry.services.game.isPlaying = true;
        context.registry.services.render.reRender(context.plugin.region);
    }
}

export class StopController extends PropController {
    acceptedProps() { return [GameViewerProps.Stop]; }

    click(context) {
        context.registry.services.game.isPlaying = false;
        context.registry.services.render.reRender(context.plugin.region);
    }
}