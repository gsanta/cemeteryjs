import { ActionType } from "../../../stores/ActionStore";

export interface IActionNode {
    type: ActionType;
    title: string;
    color: string;
}