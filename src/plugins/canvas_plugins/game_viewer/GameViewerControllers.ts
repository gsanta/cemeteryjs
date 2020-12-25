import { ParamControllers, PropContext, PropController } from "../../../core/plugin/controller/FormController";
import { Registry } from "../../../core/Registry";
import { UI_Element } from "../../../core/ui_components/elements/UI_Element";
import { GameToolId } from "./tools/GameTool";

export class GameViewerControllers extends ParamControllers {
    constructor(registry: Registry) {
        super();

        this.playStart = new PlayController(registry);
        this.playStop = new StopController(registry);
        this.gameViewerTool = new GameViewerToolController(registry);
    }

    playStart: PlayController;
    playStop: StopController;
    gameViewerTool: GameViewerToolController;
}

export class PlayController extends PropController {
    click() {
        this.registry.stores.game.gameState = 'running';
        this.registry.services.render.reRenderAll();
    }
}

export class StopController extends PropController {
    click() {
        this.registry.stores.game.gameState = 'paused';
        this.registry.services.render.reRenderAll();
    }
}

export class GameViewerToolController extends PropController {

    click() {
        element.canvasPanel.toolController.setSelectedTool(element.key);
        this.registry.services.render.reRender(element.canvasPanel.region);
    }
}