import { NodeObj, BuiltinNodeType, NodeCategory, NodeParam } from "../../core/models/game_objects/NodeObj";
import { Registry } from "../../core/Registry";
import { AbstractController } from "../../core/plugins/controllers/AbstractController";
import { NodeGraph } from "../../core/services/node/NodeGraph";


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