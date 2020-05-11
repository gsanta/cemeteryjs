import { ActionType } from "../../../stores/ActionStore";
import { IActionNode } from "./IActionNode";

export class MovedActionNode implements IActionNode {
    type = ActionType.Keyboard;
    title = "Move";
    movement: string;
}