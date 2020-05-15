import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { INode, NodeType } from "./INode";

export enum Movement {
    Left = 'Move Left',
    Right = 'Move Right',
    Forward = 'Move Forward',
    Backward = 'Move Backward'
}

export function getAllMovements() {
    const movements: string[] = [];

    for (let item in Movement) {
        if (isNaN(Number(item))) {
            movements.push(item);
        }
    }

    return movements;
}

export class MoveNode implements INode {
    type = NodeType.Move;
    group = NodeGroupName.Default;
    title = "Move";
    movement: string;
    color = 'A194EC';
    inputSlots = 2;
    outputSlots = 1;
}