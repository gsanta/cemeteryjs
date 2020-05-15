import { ActionType } from "../../../stores/ActionStore";
import { INode } from "./INode";

export class AndNode implements INode {
    type = ActionType.And;
    title = "And";
    color = '#A19F99';
    inputSlots = 2;
    outputSlots = 1;
}