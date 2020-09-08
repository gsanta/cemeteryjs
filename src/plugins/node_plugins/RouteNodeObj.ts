import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";

export class RouteNodeObj extends NodeObj {
    type: BuiltinNodeType.Route;
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
            name: 'mesh'
        },
        {
            direction: 'input',
            name: 'path'
        },
        {
            direction: 'output',
            name: 'onStart'
        },
        {
            direction: 'output',
            name: 'onTurnStart'
        },
        {
            direction: 'output',
            name: 'onTurnEnd'
        },
        {
            direction: 'output',
            name: 'onFinish'
        }
    ];

    static instantiate(): NodeObj {
        return new RouteNodeObj();
    }
}