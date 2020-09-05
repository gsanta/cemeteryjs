import { AbstractController, PropControl } from "../../../core/plugins/controllers/AbstractController";
import { UI_Plugin } from "../../../core/plugins/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { GameViewerController } from "../game_viewer/GameViewerController";
import { ToolType } from "../../../core/plugins/tools/Tool";
import { CameraTool } from "../../../core/plugins/tools/CameraTool";

export enum NodeEditorProps {
    DropNode = 'DropNode',
    ZoomIn = 'zoomIn',
    ZoomOut = 'ZoomOut'
}

export const NodeEditorControllerId = 'node_editor_controller_id';
export class NodeEditorController extends AbstractController<string> {
    id = NodeEditorControllerId;

    droppableId: string; 

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.registerPropControl(NodeEditorProps.ZoomIn, ZoomInControl);
        this.registerPropControl(NodeEditorProps.ZoomOut, ZoomOutControl);
    }
}

const ZoomInControl: PropControl<any> = {
    click(context, element, controller: GameViewerController) {
        (controller.plugin.toolHandler.getById(ToolType.Camera) as CameraTool).zoomIn();
    }
}

const ZoomOutControl: PropControl<any> = {
    click(context, element, controller: GameViewerController) {
        (controller.plugin.toolHandler.getById(ToolType.Camera) as CameraTool).zoomOut();
    }
}