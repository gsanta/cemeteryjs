import { BuiltinNodeType, NodeCategory, NodeObj } from "../../core/models/game_objects/NodeObj";
import { AbstractController } from "../../core/plugins/controllers/AbstractController";
import { UI_Plugin } from "../../core/plugins/UI_Plugin";
import { Registry } from "../../core/Registry";
import { NodeGraph } from "../../core/services/node/NodeGraph";
import { NodeFactory } from "../../core/services/NodeService";

export const AndNodeFacotry: NodeFactory = {
    newNodeInstance(graph: NodeGraph): NodeObj {
        return new AndNodeObj(graph);
    },

    newControllerInstance(plugin: UI_Plugin, registry: Registry): AbstractController<any> {
        const controller = new AbstractController(plugin, registry);
        return controller;
    }
}

export class AndNodeObj extends NodeObj {
    type = BuiltinNodeType.And;
    category = NodeCategory.Default;

    inputs = [
        {
            name: 'input1'
        },
        {
            name: 'input2'
        }
    ];

    outputs = [
        {
            name: 'output'
        }
    ];

    newInstance(graph: NodeGraph): NodeObj {
        return new AndNodeObj(graph);
    }

    newControllerInstance(registry: Registry): AbstractController {
        return undefined;
    }
}