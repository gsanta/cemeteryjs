import { NodeCategory, NodeObj, NodeParam } from "../../../../core/models/objs/NodeObj";
import { NodeView } from "../../../../core/models/views/NodeView";
import { FormController, PropController } from "../../../../core/plugin/controller/FormController";
import { UI_Plugin, UI_Region } from "../../../../core/plugin/UI_Plugin";
import { Registry } from "../../../../core/Registry";
import { getAllKeys } from "../../../../core/services/input/KeyboardService";
import { NodeGraph } from "../../../../core/services/node/NodeGraph";
import { NodeFactory } from "../../../../core/services/NodeService";
import { UI_InputElement } from "../../../../core/ui_components/elements/UI_InputElement";
import { GameViewerPluginId } from "../../game_viewer/GameViewerPlugin";
import { GameTool, GameToolType } from "../../game_viewer/tools/GameTool";

export const KeyboardNodeFacotry: NodeFactory = {
    createNodeObj(graph: NodeGraph): NodeObj {
        try {
            throw new Error('err creating obj')
        } catch(e) {
            console.log(e)
        }
        return new KeyboardNodeObj(graph);
    },

    createController(plugin: UI_Plugin, registry: Registry): FormController {
        const controller = new FormController(plugin, registry);
        controller.registerPropControl(new KeyControl('key1'));
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

        const keyRegex = /key(\d*)/;

        const keys = nodeView.getObj().getParams().filter(param => param.name.match(keyRegex));
        let newIndex = 2;

        const keyIndexes = keys.map(key => parseInt(key.name.match(keyRegex)[1], 10));
        keyIndexes.sort((a, b) => b - a);

        if (keyIndexes.length > 0) {
            newIndex = keyIndexes[0] + 1;
        }
        
        nodeView.getObj().addParam({
            name: `key${newIndex}`,
            val: '',
            inputType: 'list',
            valueType: 'string',
            isLink: 'output'
        });
        context.clearTempVal();
        nodeView.setup();
        // nodeView.updateDimensions();
        nodeView.controller.registerPropControl(new KeyControl(`key${newIndex}`));
        context.registry.services.render.reRender(UI_Region.Canvas1);
    }
}