import { NodeCategory, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropController } from "../../../../core/plugin/controller/FormController";
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

    newControllerInstance(plugin: UI_Plugin, registry: Registry): FormController {
        const controller = new FormController(plugin, registry);
        controller.registerPropControl('key1', new KeyControl('key1'));
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

        const gameTool = <GameTool> registry.plugins.getToolController(GameViewerPluginId).getById(GameToolType);
        
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

export class KeyControl extends PropController {
    values() {
        return getAllKeys();
    }

    defaultVal(context, element: UI_InputElement) {
        return (context.registry.stores.viewStore.getById(element.target) as NodeView).getObj().getParam(element.prop).val;
    }

    change(val, context, element: UI_InputElement) {
        context.updateTempVal(val);
        const nodeView = context.registry.stores.viewStore.getById(element.target) as NodeView;
        nodeView.getObj().setParam(element.prop, val);
        context.registry.services.history.createSnapshot();

        nodeView.getObj().addParam({
            name: 'key2',
            val: '',
            inputType: 'list',
            valueType: 'string',
            isLink: 'output'
        });
        context.clearTempVal();
        nodeView.updateDimensions();
        nodeView.controller.registerPropControl('key2', new KeyControl('key2'));
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}