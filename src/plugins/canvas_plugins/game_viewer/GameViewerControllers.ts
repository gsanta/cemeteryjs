import { PropContext, PropController } from "../../../core/plugin/controller/FormController";
import { UI_Element } from "../../../core/ui_components/elements/UI_Element";
import { GameViewerProps } from "./GameViewerProps";
import { GameToolId } from "./tools/GameTool";


export class StopController extends PropController {
    acceptedProps() { return [GameViewerProps.Stop]; }

    click(context: PropContext) {
        context.registry.stores.game.gameState = 'paused';
        context.registry.services.render.reRender(context.panel.region);
    }
}

export class GameViewerToolController extends PropController<any> {
    acceptedProps() { return [GameToolId]; }

    click(context: PropContext, element: UI_Element) {
        element.canvasPanel.getToolController().setSelectedTool(element.key);
        context.registry.services.render.reRender(context.registry.plugins.getPanelById(element.pluginId).region);
    }
}