import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { NodeModel, NodeType, JoinPointSlot } from './NodeModel';

export class TurnNode extends NodeModel {
    type = NodeType.Turn;
    group = NodeGroupName.Default;
    title = "Turn";
    move: string;
    allMoves: string[] = ['turn-left', 'turn-right'];
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