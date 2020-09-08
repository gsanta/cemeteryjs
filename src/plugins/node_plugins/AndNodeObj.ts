import { NodeObj, BuiltinNodeType, NodeCategory, NodeParam } from "../../core/models/game_objects/NodeObj";
import { AndNodePlugin } from "./AndNodePlugin";


export class AndNodeObj extends NodeObj {
    type: BuiltinNodeType.And;
    category: NodeCategory.Default;

    connections = [
        {
            direction: 'input',
            name: 'input1'
        },
        {
            direction: 'input',
            name: 'input2'
        },
        {
            direction: 'output',
            name: 'output'
        }
    ];

    static instantiate(): NodeObj {
        return new AndNodeObj();
    }
}