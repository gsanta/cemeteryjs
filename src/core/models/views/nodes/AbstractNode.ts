import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { JoinPointView } from "../child_views/JoinPointView";

export enum NodeType {
    Keyboard = 'Keyboard',
    Move = 'Move',
    And = 'And',
    Mesh = 'Mesh',
    Animation = 'Animation'
}

export interface ConnectionSlot {
    name: string;
    connectionPoint?: JoinPointView;
}

export abstract class AbstractNode {
    isDirty = false;
    type: NodeType;
    group: NodeGroupName;
    title: string;
    color: string;
    inputSlots: ConnectionSlot[];
    outputSlots: ConnectionSlot[];
}