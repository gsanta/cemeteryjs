import { NodeModel, NodeType, JoinPointSlot, NodeCategory } from '../game_objects/NodeModel';

export class SplitNode extends NodeModel {
    type = NodeType.Split;
    category = NodeCategory.Boolean;
    title = "Split";
    color = '#A19F99';
    inputSlots: JoinPointSlot[] = [
        {
            name: 'input'
        }
    ]
    outputSlots: JoinPointSlot[] = [
        {
            name: 'output1'
        },
        {
            name: 'output2'
        },
        {
            name: 'output3'
        },
        {
            name: 'output4'
        }
    ]
}