import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { NodeModel, NodeType, SlotName, JoinPointSlot } from './NodeModel';



export class MoveNode extends NodeModel {
    type = NodeType.Move;
    group = NodeGroupName.Default;
    title = "Move";
    move: string;
    speed = 0.5;
    allMoves: string[] = ['forward', 'backward'];
    color = 'A194EC';
    inputSlots: JoinPointSlot[] = [
        {
            name: 'input'
        },
        {
            name: 'mesh'
        }
    ];
    outputSlots: JoinPointSlot[] = [
        {
            name: 'animation'
        }
    ];
}