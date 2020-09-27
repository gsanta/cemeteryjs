import { NodeCategory, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { AbstractController, PropControl } from "../../../../core/plugin/controller/AbstractController";
import { UI_Plugin, UI_Region } from "../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../core/Registry";
import { getAllKeys } from "../../../../core/services/input/KeyboardService";
import { NodeGraph } from "../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../core/services/NodeService";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
import { GameViewerPlugin, GameViewerPluginId } from "../../game_viewer/GameViewerPlugin";
import { GameTool, GameToolType } from "../../game_viewer/tools/GameTool";

export const KeyboardNodeFacotry: NodeFactory = {
    newNodeInstance(graph: NodeGraph): NodeObj {
        return new KeyboardNodeObj(graph);
    },

    newControllerInstance(plugin: UI_Plugin, registry: Registry): AbstractController {
        const controller = new AbstractController(plugin, registry);
        controller.registerPropControl('key1', KeyControl);
        return controller;
    }
}

export const KeyboardNodeType = 'keyboard-node-obj';
export class KeyboardNodeObj extends NodeObj {
    type = KeyboardNodeType;
    category = NodeCategory.Default;
    displayName = 'Keyboard';

    constructor(nodeGraph: NodeGraph) {
        super(nodeGraph);

        this.addParam({
            name: 'key1',
            val: '',
            inputType: 'list',
            valueType: 'string',
            isLink: 'output'
        });
    }
    
    execute(registry: Registry) {
        const keyParams = this.getKeyParams();

        const gameViewerPlugin = <GameViewerPlugin> registry.plugins.getById(GameViewerPluginId);
        const gameTool = <GameTool> gameViewerPlugin.toolHandler.getById(GameToolType);
        
        const param = keyParams.find(param => param.val === gameTool.lastExecutedKey);

        if (param) {
            const connection = this.connections.get(param.name);
            connection && connection.getOtherNode(this).execute(registry);
        }
    }

    private getKeyParams(): NodeParam[] {
        const keyParams: NodeParam[] = [];
        let i = 1;
        while(this.hasParam(`key${i}`)) {
            keyParams.push(this.getParam(`key${i}`));
            break;
        }

        return keyParams;
    }
}

const KeyControl: PropControl<string> = {
    values() {
        return getAllKeys();
    },

    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.viewStore.getById(element.target) as NodeView).getObj().getParam(element.prop).val;
    },

    change(val, context, element: UI_InputElement) {
        context.updateTempVal(val);
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        nodeView.getObj().setParam(element.prop, val);
        context.registry.services.history.createSnapshot();

        nodeView.getObj().addParam(        {
            name: 'key2',
            val: '',
            inputType: 'list',
            valueType: 'string',
            isLink: 'output'
        });
        context.clearTempVal();
        nodeView.updateDimensions();
        nodeView.controller.registerPropControl('key2', KeyControl);
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}