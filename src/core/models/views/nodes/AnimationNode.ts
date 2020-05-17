import { AbstractNode, NodeType } from "./AbstractNode";
import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";


export class AnimationNode extends AbstractNode {
    type = NodeType.Animation;
    group = NodeGroupName.Default;
    title = "Animation";
    animation: string;
    color = '#89BD88';
    inputSlots = [
        {
            name: 'action'
        }
    ];
    outputSlots = [];
}