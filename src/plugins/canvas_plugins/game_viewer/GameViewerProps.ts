import { PropContext, PropController } from "../../../core/plugin/controller/FormController";

export enum GameViewerProps {
    Play = 'Play',
    Stop = 'Stop'
}

export class PlayController extends PropController {
    acceptedProps() { return [GameViewerProps.Play]; }

    click(context) {
        context.registry.stores.game.gameState = 'running';
        context.registry.services.render.reRender(context.plugin.region);
    }
}

export class StopController extends PropController {
    acceptedProps() { return [GameViewerProps.Stop]; }

    click(context: PropContext) {
        context.registry.stores.game.gameState = 'paused';
        context.registry.services.render.reRender(context.panel.region);
    }
}