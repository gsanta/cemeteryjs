import { NodeModel, BuiltinNodeType, JoinPointSlot, NodeCategory } from '../game_objects/NodeModel';

export class AndNode extends NodeModel {
    type = BuiltinNodeType.And;
    category = NodeCategory.Boolean;
    label = "And";
    color = '#A19F99';
    inputSlots: JoinPointSlot[] = [
        {
            name: 'input1'
        },
        {
            name: 'input2'
        }
    ]
    outputSlots: JoinPointSlot[] = [
        {
            name: 'output'
        }
    ]
}