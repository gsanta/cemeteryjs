import { NodeModel, NodeType, JoinPointSlot } from './NodeModel';
import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";

export class AndNode extends NodeModel {
    type = NodeType.And;
    group = NodeGroupName.Boolean;
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