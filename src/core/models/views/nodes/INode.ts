import { ActionType } from "../../../stores/ActionStore";

export interface INode {
    type: ActionType;
    title: string;
    color: string;
    inputSlots: number;
    outputSlots: number;
}