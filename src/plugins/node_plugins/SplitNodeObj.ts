import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";

export class SplitNodeObj extends NodeObj {
    type: BuiltinNodeType.Split;
    category: NodeCategory.Default;
    params: NodeParam[] = [
        {
            name: 'route',
            val: '',
            inputType: 'textField',
            valueType: 'string'
        }
    ];

    connections = [
        {
            direction: 'input',
            name: 'input'
        },
        {
            direction: 'output',
            name: 'output1'
        },
        {
            direction: 'output',
            name: 'output2'
        },
        {
            direction: 'output',
            name: 'output3'
        },
        {
            direction: 'output',
            name: 'output4'
        }
    ];

    static instantiate(): NodeObj {
        return new SplitNodeObj();
    }
}