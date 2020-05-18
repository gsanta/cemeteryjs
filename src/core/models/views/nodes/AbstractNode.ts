import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { JoinPointView } from "../child_views/JoinPointView";
import { NodeGraph } from '../../NodeGraph';
import { NodeView } from '../NodeView';

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
    protected nodeView: NodeView;

    constructor(nodeView: NodeView) {
        this.nodeView = nodeView;
    }
    isDirty = false;
    type: NodeType;
    group: NodeGroupName;
    title: string;
    color: string;
    inputSlots: ConnectionSlot[];
    outputSlots: ConnectionSlot[];
    updateNode(graph: NodeGraph): void {}

    findSlotByName(name: string) {
        return this.inputSlots.find(slot => slot.name === name) || this.outputSlots.find(slot => slot.name === name);
    }
}