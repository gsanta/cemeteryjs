import { NodeModel, NodeType, JoinPointSlot, NodeCategory } from './NodeModel';

export class TurnNode extends NodeModel {
    type = NodeType.Turn;
    category = NodeCategory.Default;
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