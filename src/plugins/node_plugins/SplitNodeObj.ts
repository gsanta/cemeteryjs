import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { Registry } from "../../core/Registry";
import { AbstractController } from "../../core/plugins/controllers/AbstractController";

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

    newInstance(): NodeObj {
        return new SplitNodeObj();
    }

    newControllerInstance(registry: Registry): AbstractController {
        const controller = new AbstractController(null, registry);
        return controller;
    }
}