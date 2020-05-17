import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";


export enum NodeType {
    Keyboard = 'Keyboard',
    Move = 'Move',
    And = 'And',
    Mesh = 'Mesh',
    Animation = 'Animation'
}

export interface ConnectionSlot {
    name: string;
}

export interface AbstractNode {
    type: NodeType;
    group: NodeGroupName;
    title: string;
    color: string;
    inputSlots: ConnectionSlot[];
    outputSlots: ConnectionSlot[];
}