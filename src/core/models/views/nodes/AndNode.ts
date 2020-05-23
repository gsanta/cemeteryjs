import { NodeModel, NodeType, JoinPointSlot, NodeCategory } from './NodeModel';

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