import { ActionType } from "../../../stores/ActionStore";
import { IActionNode } from "./IActionNode";

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

export class MoveActionNode implements IActionNode {
    type = ActionType.Move;
    title = "Move";
    movement: string;
    color = 'A194EC';
    inputSlots = 2;
    outputSlots = 1;
}