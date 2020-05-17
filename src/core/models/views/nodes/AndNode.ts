import { AbstractNode, NodeType } from "./AbstractNode";
import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";

export class AndNode extends AbstractNode {
    type = NodeType.And;
    group = NodeGroupName.Boolean;
    title = "And";
    color = '#A19F99';
    inputSlots = [
        {
            name: 'input1'
        },
        {
            name: 'input2'
        }
    ]
    outputSlots = [
        {
            name: 'output'
        }
    ]
}