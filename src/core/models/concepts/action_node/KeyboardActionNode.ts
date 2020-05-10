import { ActionType } from "../../../stores/ActionStore";
import { IActionNode } from "./IActionNode";

export class KeyboardActionNode implements IActionNode {
    type = ActionType.Keyboard;
    key: string;
}