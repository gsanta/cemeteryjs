import { AbstractCanvasPanel, InteractionMode } from "../../../../core/plugin/AbstractCanvasPanel";
import { PropContext, PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Element } from "../../../../core/ui_components/elements/UI_Element";
import { GameToolId } from "./tools/GameTool";

export enum GameViewerProps {
    Play = 'Play',
    Stop = 'Stop',
    EditMode = 'EditMode',
    ExecutionMode = 'ExecutionMode'
}

export class PlayController extends PropController {
    acceptedProps() { return [GameViewerProps.Play]; }

    click(context) {
        context.registry.stores.game.gameState = 'running';
        context.registry.services.render.reRender(context.plugin.region);
    }
}

export class EditModeController extends PropController {
    acceptedProps() { return [GameViewerProps.EditMode]; }

    click(context: PropContext, element: UI_Element) {
        (element.canvasPanel as AbstractCanvasPanel).interactionMode = InteractionMode.Edit;
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

export class InteractionModeController extends PropController {
    acceptedProps() { return [GameViewerProps.ExecutionMode]; }

    click(context: PropContext, element: UI_Element) {
        (element.canvasPanel as AbstractCanvasPanel).interactionMode = InteractionMode.Execution;
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

export class StopController extends PropController {
    acceptedProps() { return [GameViewerProps.Stop]; }

    click(context: PropContext) {
        context.registry.stores.game.gameState = 'paused';
        context.registry.services.render.reRenderAll();
    }
}

export class GameViewerToolController extends PropController<any> {
    acceptedProps() { return [GameToolId]; }

    click(context: PropContext, element: UI_Element) {
        element.canvasPanel.toolController.setSelectedTool(element.key);
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}