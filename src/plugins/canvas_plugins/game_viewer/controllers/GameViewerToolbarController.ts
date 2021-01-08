import { AbstractCanvasPanel, InteractionMode, ZoomInController, ZoomOutController } from "../../../../core/plugin/AbstractCanvasPanel";
import { ParamControllers, PropContext, PropController } from "../../../../core/plugin/controller/FormController";
import { CommonToolController } from "../../../../core/plugin/controller/ToolController";
import { Registry } from "../../../../core/Registry";
import { UI_Element } from "../../../../core/ui_components/elements/UI_Element";
import { GameToolId } from "./tools/GameTool";

export enum GameViewerProps {
    Play = 'Play',
    Stop = 'Stop',
    EditMode = 'EditMode',
    ExecutionMode = 'ExecutionMode'
}

export class GameViewerToolbarController extends ParamControllers {

    constructor(registry: Registry) {
        super();

        this.editMode = new EditModeController(registry);
        this.interactionMode = new InteractionModeController(registry);
        this.gameViewerTool = new GameViewerToolController(registry);
        this.commonTool = new CommonToolController(registry);
        this.zoomIn = new ZoomInController(registry);
        this.zoomOut = new ZoomOutController(registry);
    }
    
    editMode: PropController;
    interactionMode: PropController;
    gameViewerTool: PropController;
    commonTool: PropController;
    zoomIn: PropController;
    zoomOut: PropController;
}

export class PlayController extends PropController {
    acceptedProps() { return [GameViewerProps.Play]; }

    click(context) {
        context.registry.stores.game.gameState = 'running';
        context.registry.services.render.reRender(context.plugin.region);
    }
}

class EditModeController extends PropController {
    acceptedProps() { return [GameViewerProps.EditMode]; }

    click(context: PropContext, element: UI_Element) {
        (element.canvasPanel as AbstractCanvasPanel).interactionMode = InteractionMode.Edit;
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

class InteractionModeController extends PropController {
    acceptedProps() { return [GameViewerProps.ExecutionMode]; }

    click(context: PropContext, element: UI_Element) {
        (element.canvasPanel as AbstractCanvasPanel).interactionMode = InteractionMode.Execution;
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

class GameViewerToolController extends PropController<any> {
    acceptedProps() { return [GameToolId]; }

    click(context: PropContext, element: UI_Element) {
        element.canvasPanel.toolController.setSelectedTool(element.key);
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}