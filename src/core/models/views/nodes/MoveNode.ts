import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { NodeModel, NodeType } from "./NodeModel";

export enum MoveNodeSlot {
    Input = 'input',
    Animation = 'animation',
    Mesh = 'mesh'
}

export class MoveNode extends NodeModel {
    type = NodeType.Move;
    group = NodeGroupName.Default;
    title = "Move";
    move: string;
    allMoves: string[] = ['forward', 'backward'];
    color = 'A194EC';
    inputSlots = [
        {
            name: MoveNodeSlot.Input
        },
        {
            name: MoveNodeSlot.Mesh
        }
    ];
    outputSlots = [
        {
            name: MoveNodeSlot.Animation
        }
    ];
}