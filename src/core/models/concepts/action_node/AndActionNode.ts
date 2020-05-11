import { ActionType } from "../../../stores/ActionStore";
import { IActionNode } from "./IActionNode";

export class AndActionNode implements IActionNode {
    type = ActionType.And;
    title = "And";
    color = '#A19F99';
    inputSlots = 2;
    outputSlots = 1;
}