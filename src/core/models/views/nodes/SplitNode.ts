import { NodeModel, NodeType, JoinPointSlot } from './NodeModel';
import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";

export class SplitNode extends NodeModel {
    type = NodeType.Split;
    group = NodeGroupName.Boolean;
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