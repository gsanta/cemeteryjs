import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";


export enum NodeType {
    Keyboard = 'Keyboard',
    Move = 'Move',
    And = 'And',
    Mesh = 'Mesh'
}

export interface INode {
    type: NodeType;
    group: NodeGroupName;
    title: string;
    color: string;
    inputSlots: number;
    outputSlots: number;
}