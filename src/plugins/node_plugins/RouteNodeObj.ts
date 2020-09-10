import { NodeObj, NodeParam, BuiltinNodeType, NodeCategory } from "../../core/models/game_objects/NodeObj";
import { Registry } from "../../core/Registry";
import { AbstractController } from "../../core/plugins/controllers/AbstractController";
import { NodeGraph } from "../../core/services/node/NodeGraph";

export class RouteNodeObj extends NodeObj {
    type = BuiltinNodeType.Route;
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
            name: 'mesh'
        },
        {
            name: 'path'
        }
    ];

    outputs = [
        {
            name: 'onStart'
        },
        {
            name: 'onTurnStart'
        },
        {
            name: 'onTurnEnd'
        },
        {
            name: 'onFinish'
        }
    ];

    newInstance(graph: NodeGraph): NodeObj {
        return new RouteNodeObj(graph);
    }

    newControllerInstance(registry: Registry): AbstractController {
        const controller = new AbstractController(null, registry);
        return controller;    
    }
}