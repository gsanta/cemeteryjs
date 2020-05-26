import { JoinPointSlot, NodeModel, NodeType, NodeCategory } from './NodeModel';

export class MoveNode extends NodeModel {
    type = NodeType.Move;
    category = NodeCategory.Default;
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