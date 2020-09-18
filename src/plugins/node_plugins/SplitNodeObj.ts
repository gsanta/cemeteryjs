import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { Registry } from "../../core/Registry";
import { AbstractController } from "../../core/plugins/controllers/AbstractController";
import { NodeGraph } from "../../core/services/node/NodeGraph";
import { UI_Plugin } from "../../core/plugins/UI_Plugin";
import { NodeFactory } from "../../core/services/NodeService";

export const SplitNodeFacotry: NodeFactory = {
    newNodeInstance(graph: NodeGraph): NodeObj {
        return new SplitNodeObj(graph);
    },

    newControllerInstance(plugin: UI_Plugin, registry: Registry): AbstractController<any> {
        const controller = new AbstractController(plugin, registry);
        return controller;
    }
}

export class SplitNodeObj extends NodeObj {
    type = BuiltinNodeType.Split;
    category = NodeCategory.Default;
    params: NodeParam[] = [
        {
            name: 'route',
            val: '',
            inputType: 'textField',
            valueType: 'string'
        }
    ];

    inputs = [
        {
            name: 'input'
        },
        {
            name: 'output1'
        },
    ];

    outputs = [
        {
            name: 'output2'
        },
        {
            name: 'output3'
        },
        {
            name: 'output4'
        }
    ];
}