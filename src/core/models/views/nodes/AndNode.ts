import { INode, NodeType } from "./INode";
import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";

export class AndNode implements INode {
    type = NodeType.And;
    group = NodeGroupName.Boolean;
    title = "And";
    color = '#A19F99';
    inputSlots = 2;
    outputSlots = 1;
}