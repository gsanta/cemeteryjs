import { NodeModel, NodeType, JoinPointSlot, NodeCategory } from '../game_objects/NodeModel';

export class AndNode extends NodeModel {
    type = NodeType.And;
    category = NodeCategory.Boolean;
    title = "And";
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