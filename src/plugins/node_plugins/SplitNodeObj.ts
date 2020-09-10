import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { Registry } from "../../core/Registry";
import { AbstractController } from "../../core/plugins/controllers/AbstractController";
import { NodeGraph } from "../../core/services/node/NodeGraph";

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

    newInstance(graph: NodeGraph): NodeObj {
        return new SplitNodeObj(graph);
    }

    newControllerInstance(registry: Registry): AbstractController {
        const controller = new AbstractController(null, registry);
        return controller;
    }
}